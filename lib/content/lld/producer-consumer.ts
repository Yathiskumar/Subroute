import type { RoadmapLesson } from "@/lib/content/types";

export const producerConsumer: RoadmapLesson = {
  title: "Producer–Consumer",
  oneLiner:
    "Two roles that work at different speeds, joined by one shared queue between them. Think of a restaurant kitchen pass: the 🧑‍🍳 chef puts finished plates on a five-slot shelf, the 🧍 waiter carries them away. If the chef is faster the shelf fills and the chef has to wait; if the waiter is faster the shelf empties and the waiter has to wait. That waiting — a **bounded buffer** with a blocking `put()` and a blocking `take()` — *is* the Producer–Consumer pattern.",
  difficulty: "intermediate",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/producer-consumer.html",
  content: {
    prototypeCaption:
      "A **five-slot buffer** with a 🧑‍🍳 *Producer* on the left and a 🧍 *Consumer* on the right. Hit **＋ Produce** — a numbered 🍽 item drops into the next free slot and the caption ticks to `buffer: 1/5`. Fill all five and press ＋ Produce again: the producer card turns amber and reads **BLOCKED · full**, and the `put(): while (buffer is full) notFull.await();` line lights up — that one moment is the whole lesson. Press **− Consume** and item **#1** leaves from the head (FIFO), the producer instantly flips back to `running`: a slot freed, `notifyAll()` woke it. Press **▶ Auto** to watch it run: with **🧑‍🍳 producer fast** the queue fills and the producer parks; click **🧍 consumer fast** and the queue drains until the *consumer* parks at `0/5` instead. The **∞ unbounded** chip removes the bound — nothing ever blocks, and the buffer spills past its box in red until memory runs out.",

    overview: [
      {
        type: "p",
        text: "**Producer–Consumer** is the answer to a question that shows up in every concurrent program: *what do I do when one part of my system makes work faster than another part can finish it?* The answer is to stop letting them call each other directly. Put a **queue** between them. One side (the *producer*) only ever adds items to the queue; the other side (the *consumer*) only ever removes them. Neither one waits for the other to finish a task — they only ever touch the shared buffer.",
      },
      {
        type: "p",
        text: "Picture a restaurant **kitchen pass**: the shelf between the kitchen and the dining room, with room for five plates. The chef cooks and slides plates onto the pass. The waiter picks plates off it and carries them out. They never coordinate directly, never wait for each other's whole job, and neither one needs to know how fast the other is. But the shelf only fits five plates, and that is the interesting part. If the chef is quicker, the pass fills up and the chef **has to stop and wait** for a free spot. If the waiter is quicker, the pass empties and the waiter **has to stop and wait** for a plate. Those two waits are the entire pattern.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Producer–Consumer = a **bounded buffer** where `put()` blocks while the buffer is full and `take()` blocks while it is empty. The bound is what gives you **back-pressure**: a full queue slows the fast side down instead of letting it eat all your memory.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already met it",
        text: "A **print spooler** (apps produce print jobs, the printer consumes them one at a time). A **log pipeline** (your app threads produce log lines, one writer thread consumes and flushes them to disk). A **web server accept queue** (the accept loop produces sockets, a thread pool consumes them). A **Kafka topic** (services produce events, consumer groups read them). Every thread pool you have ever used is Producer–Consumer wearing a nice API: `submit()` is `put()`, and the worker threads are consumers looping on `take()`.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Three parts, and only one of them is shared" },
      {
        type: "ul",
        items: [
          "**Producer** — runs its own loop: make an item, `put()` it in the buffer, repeat. It never calls the consumer and does not know how many consumers exist.",
          "**Consumer** — runs its own loop: `take()` an item from the buffer, process it, repeat. It never calls the producer and does not know how many producers exist.",
          "**Bounded buffer** — the *only* shared state, and therefore the only thing that needs locking. It holds a queue of items and a maximum capacity. Every rule about safety lives inside this one object.",
        ],
      },
      {
        type: "p",
        text: "That last point is what makes the pattern so valuable in an interview answer: it takes a messy N-threads-touching-N-things problem and shrinks all the synchronisation into **one class**. Get the buffer right and both sides can be plain sequential code.",
      },
      { type: "h", text: "The two blocking rules" },
      {
        type: "p",
        text: "A *bounded* buffer has a fixed capacity, so both operations have a condition they must wait on. `put()` cannot add to a full buffer, and `take()` cannot remove from an empty one. Instead of failing or spinning in a busy loop burning CPU, the calling thread goes to **sleep** and is woken when the situation changes. A **monitor** — a lock plus one or more wait-sets attached to it — is the primitive that lets a thread release the lock and sleep atomically.",
      },
      {
        type: "code",
        language: "java",
        code: `// The whole pattern, in one class. Everything shared lives here.
class BoundedBuffer<T> {
    private final Queue<T> q = new ArrayDeque<>();
    private final int capacity;                     // the BOUND

    public synchronized void put(T item) throws InterruptedException {
        while (q.size() == capacity) {              // while, NOT if
            wait();                                 // release lock + sleep
        }
        q.add(item);
        notifyAll();                                // "buffer is no longer empty"
    }

    public synchronized T take() throws InterruptedException {
        while (q.isEmpty()) {                       // while, NOT if
            wait();                                 // release lock + sleep
        }
        T item = q.remove();
        notifyAll();                                // "buffer is no longer full"
        return item;
    }
}`,
      },
      {
        type: "p",
        text: "Read the shape rather than the syntax: **check the condition, sleep while it holds, do the work, then wake everyone**. Every hand-rolled Producer–Consumer in every language is this, whatever the local names are — `wait()`/`notifyAll()` in Java, `await()`/`signal_all()` on a `Condition` in Python, `cv.wait(lock, pred)`/`notify_all()` in C++.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Use `while`, never `if` — the classic interview trap",
        text: "It is tempting to write `if (q.isEmpty()) wait();`. That is a real bug for two reasons. First, **spurious wakeups**: a thread is allowed to return from `wait()` without anyone having signalled it. Second, and far more common, **a stolen slot**: you were woken because an item arrived, but between your wakeup and your re-acquiring the lock, another consumer got there first and took it. With `if`, you fall straight through to `q.remove()` on an empty queue. With `while`, you simply re-check and go back to sleep. Rule of thumb: `wait()` never *proves* the condition is true — it only means *go and check again*.",
      },
      { type: "h", text: "Why `notifyAll()` beats `notify()` here" },
      {
        type: "p",
        text: "In the simple design above, producers and consumers wait on the **same monitor**, so the wait-set contains a mix of both. `notify()` wakes exactly one arbitrary waiter — and it might wake a *producer* when what you needed was to release a *consumer*. That producer re-checks its `while (full)` condition, sees it still holds, and goes straight back to sleep, having consumed the only wakeup. Now nobody is running and nobody will be signalled again: a **lost wakeup**, and your program deadlocks with work still queued. `notifyAll()` wakes everybody, they all re-check, the wrong ones sleep again, and the right one proceeds. Slightly wasteful, always correct. The efficient alternative is not `notify()` — it is giving each side its **own** condition variable (`notFull` and `notEmpty`) so you can signal precisely the group you mean, which is exactly what `ReentrantLock` with two `Condition` objects gives you.",
      },
      { type: "h", text: "Why the buffer must be bounded" },
      {
        type: "p",
        text: "An *unbounded* queue looks friendlier — the producer never blocks, so nothing ever stalls. That is exactly the trap. If your producer is on average faster than your consumer, the queue length grows without limit, and the only thing that eventually stops it is an `OutOfMemoryError` or the OOM killer. Worse, latency quietly rots long before that: an item sitting behind a million others might be minutes old by the time it is processed. **The bound is a feature, not a limitation.** A full buffer pushes the pain *backwards* to the producer — that is what **back-pressure** means — so the system slows down honestly instead of failing catastrophically. In the prototype, the ∞ unbounded chip shows it: items spill past the box in red and nothing ever waits.",
      },
      { type: "h", text: "Many producers, many consumers" },
      {
        type: "p",
        text: "Nothing above assumes there is only one of each. Because all the coordination lives inside the buffer, you can run 8 producers and 3 consumers with **zero** code changes — that is the real reason this pattern scales. Each `take()` hands an item to exactly one consumer (they compete for items, they do not each get a copy — that would be publish/subscribe instead). Adding consumers is how you make a slow stage keep up; the queue length is your live signal for whether you need more.",
      },
      { type: "h", text: "Just use a BlockingQueue" },
      {
        type: "p",
        text: "You should be able to *write* the class above in an interview, and you should almost never write it in production. Every platform ships a battle-tested version: `ArrayBlockingQueue`/`LinkedBlockingQueue` in Java, `queue.Queue(maxsize=...)` in Python, a buffered channel `make(chan T, 5)` in Go, `BlockingCollection<T>` in C#. They handle fairness, timeouts, bulk drains and interruption — details that are easy to get subtly wrong by hand. Use `Executors.newFixedThreadPool(n)` and you get the whole pattern (bounded queue plus consumer threads) in a single line.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Shutdown: the poison pill",
        text: "Consumers block forever on an empty queue, so you need a way to say *we're done*. The standard trick is a **poison pill**: push one special sentinel item per consumer; each consumer that takes it stops looping (and, in a shared-queue setup, puts it back for the next one). In Go you just `close(ch)` and the receive loop ends by itself.",
      },
    ],

    handsOn: [
      {
        title: "01 · Fill the buffer until the producer blocks",
        body: "Click ＋ Produce five times. Numbered 🍽 items land in the slots left to right and the caption climbs to buffer: 5/5. Now click ＋ Produce once more: no sixth item appears — the producer card turns amber and reads BLOCKED · full, and the `put(): while (buffer is full) notFull.await();` line lights up. That refusal is the whole pattern: back-pressure stopped the fast side instead of overflowing.",
      },
      {
        title: "02 · Free one slot and watch the wakeup",
        body: "With the producer still parked, hit − Consume. Item #1 leaves from the head (not the tail — that's FIFO), everything shifts down, consumed ticks to 1, and the producer flips straight back to running with the explain line 'Slot freed → producer wakes'. That's `notifyAll()`: the parked thread re-checks its `while (full)` guard, finds it false now, and proceeds. Keep hitting − Consume until 0/5 and the consumer card goes BLOCKED · empty — the mirror image.",
      },
      {
        title: "03 · Flip which side blocks, then remove the bound",
        body: "Press ▶ Auto with 🧑‍🍳 producer fast selected and watch the queue fill until the producer parks. Click 🧍 consumer fast and press ▶ Auto again: now the queue drains and the *consumer* parks at 0/5 instead. Finally toggle the ∞ unbounded chip and run Auto once more — nothing ever blocks, the buffer spills past its box in red, and the explain line reads 'No limit → memory grows'. Hit ↺ Reset to start clean.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "BoundedBuffer.java",
        code: `import java.util.ArrayDeque;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

// ---- The hand-rolled version: know this for interviews ----
class BoundedBuffer<T> {
    private final Queue<T> q = new ArrayDeque<>();
    private final int capacity;                    // the BOUND

    BoundedBuffer(int capacity) { this.capacity = capacity; }

    public synchronized void put(T item) throws InterruptedException {
        while (q.size() == capacity) {             // WHILE, not if:
            wait();                                // spurious wakeups + stolen slots
        }
        q.add(item);
        notifyAll();                               // "no longer empty" — wake everyone
    }

    public synchronized T take() throws InterruptedException {
        while (q.isEmpty()) {                      // WHILE, not if
            wait();
        }
        T item = q.remove();
        notifyAll();                               // "no longer full"
        return item;
    }

    public synchronized int size() { return q.size(); }
}

public class Demo {
    private static final String PILL = "__DONE__";  // poison pill

    public static void main(String[] args) throws Exception {
        // ---- The version you actually ship: capacity 5, blocking built in ----
        BlockingQueue<String> pass = new ArrayBlockingQueue<>(5);

        Thread chef = new Thread(() -> {           // producer
            try {
                for (int i = 1; i <= 12; i++) {
                    pass.put("plate #" + i);       // BLOCKS while full
                    System.out.println("cooked plate #" + i + "  (queue=" + pass.size() + ")");
                    Thread.sleep(60);              // fast side
                }
                pass.put(PILL);                    // one pill per consumer
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });

        Thread waiter = new Thread(() -> {         // consumer
            try {
                while (true) {
                    String plate = pass.take();    // BLOCKS while empty
                    if (PILL.equals(plate)) break; // shutdown signal
                    System.out.println("  served " + plate);
                    Thread.sleep(150);             // slow side -> queue fills
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });

        chef.start();
        waiter.start();
        chef.join();
        waiter.join();
        System.out.println("done — chef spent most of the run blocked on a full pass");
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "kitchen_pass.py",
        code: `import queue
import threading
import time

CAPACITY = 5
PILL = object()          # poison pill: one per consumer

# queue.Queue IS the bounded buffer — put() blocks when full,
# get() blocks when empty, and the locking is done for you.
pass_shelf: "queue.Queue" = queue.Queue(maxsize=CAPACITY)


def chef() -> None:                       # producer
    for i in range(1, 13):
        pass_shelf.put(f"plate #{i}")     # BLOCKS while full -> back-pressure
        print(f"cooked plate #{i}  (queue={pass_shelf.qsize()})")
        time.sleep(0.06)                  # fast side
    pass_shelf.put(PILL)                  # tell the waiter to stop


def waiter() -> None:                     # consumer
    while True:
        plate = pass_shelf.get()          # BLOCKS while empty
        if plate is PILL:
            pass_shelf.task_done()
            break
        print(f"  served {plate}")
        time.sleep(0.15)                  # slow side
        pass_shelf.task_done()


# ---- What Queue does for you, by hand, with a Condition ----
class BoundedBuffer:
    def __init__(self, capacity: int) -> None:
        self._items: list = []
        self._capacity = capacity
        self._cond = threading.Condition()          # lock + wait-set

    def put(self, item) -> None:
        with self._cond:
            while len(self._items) == self._capacity:  # WHILE, not if
                self._cond.wait()                      # release lock + sleep
            self._items.append(item)
            self._cond.notify_all()                    # "no longer empty"

    def take(self):
        with self._cond:
            while not self._items:                     # WHILE, not if
                self._cond.wait()
            item = self._items.pop(0)                  # FIFO: oldest first
            self._cond.notify_all()                    # "no longer full"
            return item


if __name__ == "__main__":
    threads = [threading.Thread(target=chef), threading.Thread(target=waiter)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print("done — the chef spent most of the run blocked on a full shelf")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "bounded_buffer.cpp",
        code: `#include <condition_variable>
#include <deque>
#include <iostream>
#include <mutex>
#include <optional>
#include <string>
#include <thread>

template <typename T>
class BoundedBuffer {
    std::deque<T> q_;
    std::size_t capacity_;
    std::mutex m_;
    std::condition_variable not_full_;    // producers wait here
    std::condition_variable not_empty_;   // consumers wait here
    bool closed_ = false;

public:
    explicit BoundedBuffer(std::size_t capacity) : capacity_(capacity) {}

    void put(T item) {
        std::unique_lock<std::mutex> lock(m_);
        // the predicate overload IS the while-loop — it re-checks on every wakeup
        not_full_.wait(lock, [this] { return q_.size() < capacity_; });
        q_.push_back(std::move(item));
        lock.unlock();
        not_empty_.notify_one();          // two CVs -> we can wake precisely
    }

    std::optional<T> take() {
        std::unique_lock<std::mutex> lock(m_);
        not_empty_.wait(lock, [this] { return !q_.empty() || closed_; });
        if (q_.empty()) return std::nullopt;   // closed and drained -> stop
        T item = std::move(q_.front());
        q_.pop_front();                        // FIFO: oldest leaves first
        lock.unlock();
        not_full_.notify_one();
        return item;
    }

    void close() {                             // shutdown signal
        { std::lock_guard<std::mutex> lock(m_); closed_ = true; }
        not_empty_.notify_all();
    }
};

int main() {
    BoundedBuffer<std::string> pass(5);        // capacity 5 kitchen pass

    std::thread chef([&] {                     // producer
        for (int i = 1; i <= 12; ++i) {
            pass.put("plate #" + std::to_string(i));   // BLOCKS while full
            std::cout << "cooked plate #" << i << "\\n";
            std::this_thread::sleep_for(std::chrono::milliseconds(60));
        }
        pass.close();
    });

    std::thread waiter([&] {                   // consumer
        while (auto plate = pass.take()) {     // BLOCKS while empty
            std::cout << "  served " << *plate << "\\n";
            std::this_thread::sleep_for(std::chrono::milliseconds(150));
        }
    });

    chef.join();
    waiter.join();
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "main.go",
        code: `package main

import (
	"fmt"
	"sync"
	"time"
)

// A buffered channel IS a bounded blocking queue:
//   ch <- x   blocks while the buffer is full   (put)
//   <-ch      blocks while the buffer is empty  (take)
// No mutex, no condition variable, no while-loop to get wrong.

func chef(pass chan<- string, wg *sync.WaitGroup) { // producer
	defer wg.Done()
	for i := 1; i <= 12; i++ {
		pass <- fmt.Sprintf("plate #%d", i) // BLOCKS while full -> back-pressure
		fmt.Printf("cooked plate #%d (queued=%d/%d)\\n", i, len(pass), cap(pass))
		time.Sleep(60 * time.Millisecond) // fast side
	}
	close(pass) // shutdown: no poison pill needed in Go
}

func waiter(id int, pass <-chan string, wg *sync.WaitGroup) { // consumer
	defer wg.Done()
	for plate := range pass { // BLOCKS while empty, ends when closed
		fmt.Printf("  waiter %d served %s\\n", id, plate)
		time.Sleep(150 * time.Millisecond) // slow side
	}
}

func main() {
	pass := make(chan string, 5) // the bounded buffer: capacity 5

	var producers, consumers sync.WaitGroup
	producers.Add(1)
	go chef(pass, &producers)

	// scale the slow side: 3 consumers share one queue, each item goes to
	// exactly ONE of them (competing consumers, not broadcast)
	for i := 1; i <= 3; i++ {
		consumers.Add(1)
		go waiter(i, pass, &consumers)
	}

	producers.Wait() // chef finished and closed the channel
	consumers.Wait() // waiters drained what was left
	fmt.Println("done")
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Producer–Consumer when..." },
      {
        type: "ul",
        items: [
          "**The two sides run at different speeds** and you want the fast one to keep going instead of waiting for each slow call — a request handler that hands work off, a scraper feeding a parser.",
          "**Work arrives in bursts** but must be processed at a steady rate. The buffer absorbs the spike; the bound stops the spike from becoming an outage.",
          "**You want to scale one stage independently** — add consumers to drain a queue faster, without touching a line of producer code.",
          "**A resource must be used by one thread at a time** — a single printer, a single log file, one database connection. Funnel all work through a queue and let one consumer own the resource.",
        ],
      },
      { type: "h", text: "Skip it when..." },
      {
        type: "ul",
        items: [
          "**The caller needs the result right now.** A queue is inherently asynchronous. If you need the answer to continue, just call the function — or use a future/promise on top.",
          "**The work is trivially fast.** Locking a queue and waking a thread can cost more than the work itself. Measure before you add a hop.",
          "**Every consumer needs every item.** That is publish/subscribe, not Producer–Consumer — here each item goes to exactly one consumer.",
          "**Strict global ordering across many consumers matters.** One queue with N consumers gives you FIFO *dequeue* order but concurrent, out-of-order *completion*. Use one consumer, or partition by key.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Decoupling — producers and consumers only know the queue, so either side can be rewritten, restarted or scaled without touching the other.",
        "Back-pressure for free — the bound turns 'my producer is too fast' from a memory-exhaustion crash into a graceful slowdown.",
        "Smooths bursts — a full second of traffic spike is absorbed by the buffer and processed at a steady rate instead of overwhelming the slow stage.",
        "All the concurrency lives in one class — the buffer is the only shared state, so producers and consumers can be plain sequential code.",
      ],
      cons: [
        "Easy to get wrong by hand — `if` instead of `while`, `notify()` instead of `notifyAll()`, or forgetting to signal at all deadlocks the whole pipeline.",
        "Adds latency and memory — every item now waits in a queue, and the queue itself is RAM you have to size deliberately.",
        "Shutdown needs a plan — consumers block forever on an empty queue, so you need poison pills, interruption or a closed channel to stop them.",
        "Harder to debug and reason about — stack traces stop at the queue boundary, and 'why is this slow?' becomes a queue-depth question rather than a call-stack one.",
      ],
    },

    furtherReading: [
      {
        label: "Guarded Blocks — The Java Tutorials",
        href: "https://docs.oracle.com/javase/tutorial/essential/concurrency/guardmeth.html",
        note: "Oracle's own walkthrough of wait()/notifyAll() built around a producer–consumer Drop object — including exactly why the guard must be a while loop.",
        kind: "docs",
      },
      {
        label: "BlockingQueue (Java SE API)",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/BlockingQueue.html",
        note: "The interface you should reach for instead of hand-rolling: put/take blocking semantics, capacity, and the memory-consistency guarantees spelled out.",
        kind: "docs",
      },
      {
        label: "queue — A synchronized queue class (Python docs)",
        href: "https://docs.python.org/3/library/queue.html",
        note: "Python's ready-made bounded buffer. Note maxsize, the blocking behaviour of put/get, and task_done()/join() for waiting until the work is drained.",
        kind: "docs",
      },
      {
        label: "std::condition_variable — cppreference",
        href: "https://en.cppreference.com/w/cpp/thread/condition_variable",
        note: "The C++ primitive, with the crucial note on spurious wakeups and why the predicate overload of wait() is the safe form of the while loop.",
        kind: "docs",
      },
      {
        label: "Go by Example: Channel Buffering",
        href: "https://gobyexample.com/channel-buffering",
        note: "Two minutes on Go's answer: a buffered channel is a bounded blocking queue baked into the language, with no lock or condition variable in sight.",
        kind: "article",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        href: "https://jcip.net/",
        note: "Chapter 5 covers blocking queues and the producer–consumer pattern as the backbone of well-behaved concurrent design, including thread pools and back-pressure.",
        kind: "book",
      },
      {
        label: "Cooperating Sequential Processes (EWD 123) — Dijkstra",
        href: "https://www.cs.utexas.edu/users/EWD/transcriptions/EWD01xx/EWD123.html",
        note: "The origin: Dijkstra introduces semaphores and solves the bounded-buffer problem here. Dense, but this is where the pattern comes from.",
        kind: "paper",
      },
    ],

    quiz: [
      {
        id: "producer-consumer-q1",
        question: "In a bounded-buffer Producer–Consumer setup, what happens when the producer calls put() on a full buffer?",
        options: [
          { id: "a", label: "The producer thread blocks (sleeps) until a consumer removes an item and frees a slot." },
          { id: "b", label: "The buffer grows automatically to make room for the new item." },
          { id: "c", label: "The oldest item is silently dropped to make space." },
          { id: "d", label: "The producer spins in a busy loop, re-checking as fast as the CPU allows." },
        ],
        correctOptionId: "a",
        explanation:
          "A bounded buffer's whole job is back-pressure: a full buffer parks the producer until a slot frees up, then a signal wakes it. (b) describes an unbounded queue, which is what the bound exists to prevent; (c) is a lossy ring buffer, a different design; (d) is busy-waiting, which burns CPU — blocking exists precisely to avoid it.",
      },
      {
        id: "producer-consumer-q2",
        question: "Why must the wait be written as `while (buffer.isEmpty()) wait();` rather than `if (buffer.isEmpty()) wait();`?",
        options: [
          { id: "a", label: "Because a thread can return from wait() without the condition being true — spurious wakeups, or another consumer taking the item first — so it must re-check." },
          { id: "b", label: "Because `if` cannot be used inside a synchronized block." },
          { id: "c", label: "Because `while` releases the lock and `if` does not." },
          { id: "d", label: "Because `while` makes the code run faster." },
        ],
        correctOptionId: "a",
        explanation:
          "Returning from wait() only means 'go and check again' — it never proves the condition holds. Spurious wakeups are permitted, and more commonly another thread grabs the item between your wakeup and your re-acquiring the lock; with `if` you would fall through and pop an empty queue. Lock release is done by wait() itself, not by the loop keyword, and this has nothing to do with syntax legality or speed.",
      },
      {
        id: "producer-consumer-q3",
        question: "Producers and consumers all wait on the same monitor. Why is notifyAll() safer than notify()?",
        options: [
          { id: "a", label: "notify() might wake a producer when a consumer needed waking; it re-checks, sleeps again, and the wakeup is lost — potentially deadlocking with work still queued." },
          { id: "b", label: "notify() is deprecated in modern Java." },
          { id: "c", label: "notifyAll() is always faster because it avoids a context switch." },
          { id: "d", label: "notify() only works if there is exactly one producer and one consumer thread in the entire program." },
        ],
        correctOptionId: "a",
        explanation:
          "With one shared wait-set holding both roles, notify() wakes an arbitrary waiter, which may be the wrong kind; it fails its guard, sleeps again, and consumes the only signal — a lost wakeup. notifyAll() wakes everyone so the right thread proceeds. It is actually less efficient, not faster, and notify() is neither deprecated nor limited to one thread each — the real fix for efficiency is two separate Condition objects (notFull/notEmpty).",
      },
      {
        id: "producer-consumer-q4",
        question: "Your producer is on average faster than your consumer and you switch to an unbounded queue so put() never blocks. What is the likely outcome?",
        options: [
          { id: "a", label: "The queue grows without limit — memory climbs until the process dies, and latency rots long before that." },
          { id: "b", label: "Throughput doubles, because the producer is never stalled." },
          { id: "c", label: "The consumer automatically speeds up to match the producer." },
          { id: "d", label: "Nothing changes; an unbounded queue behaves identically to a bounded one." },
        ],
        correctOptionId: "a",
        explanation:
          "Removing the bound removes back-pressure, so a sustained producer surplus has nowhere to go but memory — the queue grows until OOM, and queued items become stale in the meantime. The consumer's rate is unchanged (c), so total throughput is still capped by the slow side, not doubled (b); the difference from a bounded queue is precisely that nothing ever waits (d).",
      },
      {
        id: "producer-consumer-q5",
        question: "In a Producer–Consumer pipeline with one queue and three consumer threads, what happens to each item that is put on the queue?",
        options: [
          { id: "a", label: "Exactly one consumer receives it — the consumers compete for items rather than each getting a copy." },
          { id: "b", label: "All three consumers receive a copy of every item." },
          { id: "c", label: "Only the consumer that started first ever receives items." },
          { id: "d", label: "Items are split into thirds and reassembled after processing." },
        ],
        correctOptionId: "a",
        explanation:
          "take() removes an item from the shared queue, so each item is delivered to exactly one consumer — this is the competing-consumers model, and it is why adding consumers increases throughput. Broadcasting a copy to everyone (b) is publish/subscribe, a different pattern; all consumers block on the same queue equally (c), and items are never fragmented (d).",
      },
      {
        id: "producer-consumer-q6",
        question: "You need consumer threads to stop cleanly at the end of a batch, but they are blocked on an empty queue. What is the standard approach?",
        options: [
          { id: "a", label: "Push a sentinel 'poison pill' item (one per consumer) that tells each consumer to break out of its loop — or, in Go, close the channel." },
          { id: "b", label: "Call Thread.stop() on each consumer to kill it immediately." },
          { id: "c", label: "Set a global `running = false` flag and rely on the consumers noticing it." },
          { id: "d", label: "Nothing is needed — consumers exit automatically when the producer finishes." },
        ],
        correctOptionId: "a",
        explanation:
          "A blocked consumer cannot notice anything, so shutdown has to arrive through the same channel as the work: a poison-pill sentinel (or a closed Go channel, or interruption). Thread.stop() is deprecated and unsafe because it leaves shared state half-updated; a plain flag is never seen by a thread parked inside wait(); and consumers have no idea the producer ended unless you tell them.",
      },
    ],
  },
};
