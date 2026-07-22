import type { RoadmapLesson } from "@/lib/content/types";

export const threadPoolsAndExecutors: RoadmapLesson = {
  title: "Thread pools & Executors",
  oneLiner:
    "Creating a thread is expensive — it's a call into the operating system and roughly a megabyte of stack memory, every single time. A **thread pool** creates a small set of worker threads *once* and then feeds them tasks from a queue, so the same few threads are reused forever. Think of a supermarket: you don't hire a new cashier for every shopper — three cashiers serve one endless line, and the queue absorbs the rush.",
  difficulty: "intermediate",
  estimatedTime: "13 min",
  prototypePath: "/prototypes/lld/thread-pools-and-executors.html",
  content: {
    prototypeCaption:
      "One toggle, two worlds. In **🧵 new Thread() per task**, press **▶ Submit 8 tasks**: eight separate thread cards appear one by one, each flashing a **🔨 create** cost before it runs, the **threads created** counter climbs all the way to **8** (red), the cost bar fills, and the finished cards just pile up. Flip to **🏊 Thread pool (3)** and press the *same* button: three worker lanes **W1 W2 W3** already exist, the **threads created** counter is stuck at **3** (green) *before you even click*, and the queue chips `#1 … #8` visibly drain through those three lanes — each worker runs a task, flashes **✓**, and immediately grabs the next. Same eight tasks done, three threads instead of eight. Then play with the two dials: **pool size − / ＋** (1 = a slow serial drain, 4 = finishes sooner) and the **📦 queue: unbounded / bounded 4** chip, which makes the tasks that don't fit turn red **✕ REJECTED**. Counters at the top read **threads created**, **tasks done: 5/8**, **queued: 2**; one explain line narrates every click, and **↺ Reset** starts over.",

    overview: [
      {
        type: "p",
        text: "A **thread** is not free. Asking for one is a call into the operating system, and the OS hands you a fresh execution stack — on most systems around **1 MB of memory reserved per thread**. Creating and destroying one takes real time, and once you have thousands of them the CPU spends more effort *switching between* them than doing your actual work. Spawning a brand-new thread for every unit of work is the classic way to turn a traffic spike into an outage: 10 000 requests arrive, your code writes `new Thread(...).start()` 10 000 times, and the machine falls over with thrashing or an out-of-memory error.",
      },
      {
        type: "p",
        text: "A **thread pool** fixes this by flipping the relationship around. Instead of *work creates a thread*, you create a fixed set of **worker threads once**, at startup, and then hand them **tasks** through a **queue**. Each worker sits in a loop: take the next task off the queue, run it, come back for another — forever. Ten thousand requests through a pool of eight workers still means only **eight threads ever created**. That's the whole trick, and everything else in this lesson is detail around it.",
      },
      {
        type: "p",
        text: "The mental model is a **supermarket checkout**. A shop with three tills does not hire a new cashier every time a shopper walks in and fire them at the end of the transaction — that would be absurd, and hiring is the expensive part. It employs **three cashiers permanently**, forms **one queue**, and each cashier serves the next person in line the moment they're free. Shoppers are your tasks. Cashiers are your worker threads. The queue is what absorbs the rush hour instead of the shop collapsing.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Don't create a thread per task — create **N threads once** and feed them tasks from a **queue**. You submit *what* to do; the **executor** decides *which thread runs it and when*.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You are already using one",
        text: "Every web server you've ever run — Tomcat, Jetty, Gunicorn's thread workers, a Node worker pool — serves requests from a thread pool rather than spawning a thread per connection. Java's `ExecutorService`, Python's `concurrent.futures.ThreadPoolExecutor`, C#'s `ThreadPool`, and Go's runtime scheduler over a fixed set of OS threads are all the same idea.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three moving parts" },
      {
        type: "p",
        text: "Every thread pool, in every language, is built from the same three pieces:",
      },
      {
        type: "ul",
        items: [
          "**The task** — a small object holding *what to do*, and nothing about *who does it*. In Java that's a `Runnable` (returns nothing) or a `Callable` (returns a value). This is literally the [[command]] pattern: work packaged as an object so it can be stored, queued and passed around.",
          "**The queue** — where submitted tasks wait until a worker is free. This is the shock absorber: a burst of 500 tasks doesn't create 500 threads, it creates 500 queue entries.",
          "**The workers** — N threads created once at startup, each running the same infinite loop: `take()` a task from the queue (blocking if it's empty), run it, repeat. A worker never dies between tasks, so the expensive creation cost is paid **once per worker**, not once per task.",
        ],
      },
      {
        type: "code",
        language: "java",
        filename: "MiniPool.java",
        code: `// This is the entire idea of a thread pool, in ~12 lines.
class MiniPool {
    private final BlockingQueue<Runnable> queue = new ArrayBlockingQueue<>(4); // bounded!

    MiniPool(int workers) {
        for (int i = 0; i < workers; i++) {      // create N threads ONCE
            new Thread(() -> {
                while (true) {                   // ...then loop forever
                    Runnable task = queue.take(); // blocks until work arrives
                    task.run();                   // reuse this same thread
                }
            }).start();
        }
    }

    void submit(Runnable task) { queue.put(task); } // you queue WHAT, not WHO
}`,
      },
      {
        type: "p",
        text: "Read that `while (true)` loop again — it is the reason threads get reused. The worker doesn't finish when a task finishes; it goes straight back to the queue for the next one. In the prototype, that's a worker lane flashing **✓** and immediately pulling the next chip off the queue without the *threads created* counter moving.",
      },
      { type: "h", text: "Executor: the separation that makes it work" },
      {
        type: "p",
        text: "The key design move is **separating the task from its execution**. Your code says *\"here is a job\"* and stops there. The **Executor** — the pool object — owns the decision of *which thread* runs it and *when*. That single interface (`execute(Runnable)`) means you can swap a 4-thread pool for a 40-thread pool, a scheduled pool, or a same-thread executor in tests, without touching a line of the task code. Command pattern for the *what*, plus a scheduler for the *when*.",
      },
      {
        type: "p",
        text: "When a task returns a value you get back a **`Future`** (or `CompletableFuture`, or Python's `concurrent.futures.Future`) — a receipt you can later call `get()` on to collect the result, blocking until it's ready. Same as being handed a buzzer at a restaurant: you're free to go do something else, and the buzzer tells you when it's done.",
      },
      { type: "h", text: "How big should the pool be?" },
      {
        type: "ul",
        items: [
          "**CPU-bound work** (compression, hashing, image resizing) — roughly **one worker per CPU core**. The threads are genuinely busy computing, so extra threads beyond your core count just add context-switching overhead without doing more work per second.",
          "**I/O-bound work** (database calls, HTTP requests, file reads) — the pool can be **much larger**, often tens or hundreds. Those threads spend nearly all their time *blocked waiting* for a response, using no CPU at all, so you need many of them in flight to keep the machine busy.",
          "**Measure, don't guess** — the classic starting formula is `threads ≈ cores × (1 + waitTime / computeTime)`, but the real answer comes from load-testing your actual workload. Try `1` and `4` in the prototype: one worker drains the queue strictly one task at a time; four finish the same eight tasks in fewer rounds.",
        ],
      },
      { type: "h", text: "Bound the queue, or you've just moved the problem" },
      {
        type: "p",
        text: "It's tempting to use an unlimited queue — then nothing is ever refused. But an unbounded queue turns a thread-explosion into a **memory explosion**: if tasks arrive faster than the pool can finish them, the backlog grows without limit until the process dies, and every queued task gets slower and slower while nobody notices. Always give the queue a **maximum size**. A full queue is not a failure, it's **back-pressure** — the system telling its callers *\"slow down, I'm at capacity\"* while it's still healthy enough to say so.",
      },
      {
        type: "p",
        text: "When the queue is full, the pool applies a **rejection policy**: *abort* (throw an exception so the caller knows), *caller-runs* (the submitting thread executes the task itself, which naturally slows the producer down), or *discard* (drop the task, or drop the oldest queued one). In the prototype, switch the chip to **📦 queue: bounded 4** and submit 8 tasks: three fit in the running workers, four fit in the queue, and the leftover turns red **✕ REJECTED**.",
      },
      { type: "h", text: "The standard pool flavours" },
      {
        type: "ul",
        items: [
          "**Fixed** — exactly N threads, forever. The safe default for servers: predictable memory, predictable load on downstream systems.",
          "**Cached** — grows on demand and reaps threads idle for 60 seconds. Convenient for short bursts, dangerous under sustained load because it has *no upper bound* on thread count.",
          "**Single-threaded** — one worker, so tasks run strictly one at a time in submission order. Handy when you need serialised access to something without locks.",
          "**Scheduled** — runs tasks after a delay or on a repeating timer. The pooled replacement for hand-rolled `Timer` threads.",
          "**Work-stealing / ForkJoin** — each worker has its own deque and *steals* from busy neighbours when idle. Built for many small, recursive, CPU-bound subtasks (this is what Java's parallel streams run on).",
        ],
      },
      { type: "h", text: "Shutting down gracefully" },
      {
        type: "p",
        text: "Pool threads usually keep the program alive, so you must close the pool. `shutdown()` is the polite one: it stops accepting new tasks but lets everything already submitted finish. `shutdownNow()` is the impatient one: it tries to interrupt running tasks and returns the list of tasks that never started. Either way, follow up with `awaitTermination(timeout)` to actually wait for the workers to stop — the usual pattern is `shutdown()`, wait a while, then `shutdownNow()` if they're still going.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Trap 1 — a task that blocks forever eats a worker",
        text: "A worker running a task is *gone* until that task returns. One task stuck on a network call with no timeout permanently removes one thread from your pool; a handful of them and the pool is dead while looking perfectly healthy. Worse is **pool starvation deadlock**: if a task submits another task to the *same* pool and then waits for its result, and every worker is doing that, no worker is left to run the inner tasks — the pool deadlocks against itself. Always set timeouts, and never block a pooled task waiting on the same pool.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Trap 2 — exceptions vanish silently",
        text: "In Java, `execute()` lets an exception surface through the thread's uncaught-exception handler, but `submit()` **captures it inside the returned `Future`**. If you never call `future.get()`, the task can fail completely and print nothing at all — the pool just moves to the next task. Either check your futures, or wrap every task body in a try/catch that logs. Python's `ThreadPoolExecutor` behaves the same way: the exception is re-raised only when you touch the future's `result()`.",
      },
      {
        type: "callout",
        variant: "info",
        title: "What if threads were cheap?",
        text: "That's exactly what **Go's goroutines** and **Java 21's virtual threads** deliver: lightweight threads managed by the runtime, costing a few kilobytes instead of a megabyte, so millions can exist at once. With them, *thread-per-task* becomes reasonable again for blocking I/O work — you don't need a pool just to limit thread count. Pools don't disappear, though: you still want a bounded number of *concurrent* operations to protect the database or API downstream, so you cap concurrency with a semaphore or a bounded queue rather than with the thread count itself.",
      },
    ],

    handsOn: [
      {
        title: "01 · Watch thread creation run away",
        body: "Start in 🧵 new Thread() per task and press ▶ Submit 8 tasks. Eight separate thread cards appear one after another, each flashing 🔨 create before it runs, and the cards never leave — they pile up. The threads created counter climbs 1, 2, 3 … 8 in red and the cost bar fills to 100%. Every one of those 🔨 flashes is an OS call plus about 1 MB of stack. Now picture the same picture with 10 000 tasks.",
      },
      {
        title: "02 · Flip to the pool and count again",
        body: "Click 🏊 Thread pool (3). Before you press anything, note that threads created already reads 3 in green — the pool built its workers up front, and W1 W2 W3 are sitting idle. Press the same ▶ Submit 8 tasks: the chips #1 … #8 drain out of the task queue through those three lanes, each worker flashing ✓ and instantly grabbing the next chip, while queued: counts down and tasks done: climbs to 8/8. The threads created counter never moves off 3. Same work, three threads instead of eight — that's reuse.",
      },
      {
        title: "03 · Size the pool, then bound the queue",
        body: "With the pool selected, set pool size − to 1 and submit: one worker drains the queue strictly serially. Push pool size ＋ to 4 and submit again — the same eight tasks finish in fewer rounds. That's the sizing rule in miniature: CPU-bound wants about one worker per core, I/O-bound can go much higher because those threads mostly wait. Finally click 📦 queue: unbounded so it reads 📦 queue: bounded 4 and submit 8 tasks: the running workers plus four queue slots absorb what they can, and the leftover chips turn red ✕ REJECTED. That red is back-pressure — far better than an unbounded backlog quietly eating all your memory. ↺ Reset to start over.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "PoolDemo.java",
        code: `import java.util.concurrent.*;

public class PoolDemo {
    public static void main(String[] args) throws Exception {
        int cores = Runtime.getRuntime().availableProcessors();

        // A fixed pool, built by hand so every knob is visible.
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            cores, cores,                                 // core = max => fixed size
            0L, TimeUnit.MILLISECONDS,                    // no idle reaping
            new ArrayBlockingQueue<>(100),                // BOUNDED queue = back-pressure
            new ThreadPoolExecutor.CallerRunsPolicy());   // rejection: submitter runs it

        // A Runnable is just "what to do" — it says nothing about which thread.
        for (int i = 1; i <= 8; i++) {
            final int id = i;
            pool.execute(() -> System.out.println(
                "task " + id + " on " + Thread.currentThread().getName()));
        }

        // A Callable returns a value; you get a Future receipt back.
        Future<Integer> sum = pool.submit(() -> 21 + 21);
        System.out.println("result = " + sum.get());  // blocks until ready
        // NOTE: exceptions inside submit() hide in the Future until you call get().

        // Graceful shutdown: stop accepting, let queued work finish, then force.
        pool.shutdown();
        if (!pool.awaitTermination(5, TimeUnit.SECONDS)) {
            pool.shutdownNow();   // interrupt stragglers
        }
        System.out.println("threads ever created: " + pool.getLargestPoolSize());
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "pool_demo.py",
        code: `import concurrent.futures
import os
import threading
import time


def handle(task_id: int) -> str:
    time.sleep(0.05)                     # pretend this is I/O
    return f"task {task_id} on {threading.current_thread().name}"


# I/O-bound work, so more workers than cores is fine; CPU-bound would use ~os.cpu_count().
workers = min(32, (os.cpu_count() or 1) * 4)

# 'with' calls shutdown(wait=True) on exit — the graceful path.
with concurrent.futures.ThreadPoolExecutor(
        max_workers=workers, thread_name_prefix="worker") as pool:

    # submit() queues WHAT to do and returns a Future receipt.
    futures = [pool.submit(handle, i) for i in range(1, 9)]

    for fut in concurrent.futures.as_completed(futures):
        # Exceptions are stored in the Future — they only surface here.
        print(fut.result())

# The same few threads served all 8 tasks; none were created per task.
print("done — pool closed")`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "pool_demo.cpp",
        code: `#include <condition_variable>
#include <functional>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

class ThreadPool {
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex m;
    std::condition_variable cv;
    bool stopping = false;
    size_t cap;                                   // bounded queue

public:
    explicit ThreadPool(size_t n, size_t queueCap = 100) : cap(queueCap) {
        for (size_t i = 0; i < n; ++i) {          // create N threads ONCE
            workers.emplace_back([this] {
                for (;;) {                        // ...then loop forever
                    std::function<void()> job;
                    {
                        std::unique_lock<std::mutex> lk(m);
                        cv.wait(lk, [this] { return stopping || !tasks.empty(); });
                        if (stopping && tasks.empty()) return;
                        job = std::move(tasks.front());
                        tasks.pop();
                    }
                    job();                        // reuse this same thread
                }
            });
        }
    }

    bool submit(std::function<void()> job) {      // false = REJECTED (back-pressure)
        {
            std::lock_guard<std::mutex> lk(m);
            if (stopping || tasks.size() >= cap) return false;
            tasks.push(std::move(job));
        }
        cv.notify_one();
        return true;
    }

    ~ThreadPool() {                               // graceful shutdown
        { std::lock_guard<std::mutex> lk(m); stopping = true; }
        cv.notify_all();
        for (auto& t : workers) t.join();
    }
};

int main() {
    ThreadPool pool(std::thread::hardware_concurrency());   // CPU-bound ~= cores
    for (int i = 1; i <= 8; ++i) {
        if (!pool.submit([i] { std::cout << "task " << i << "\\n"; }))
            std::cout << "task " << i << " REJECTED\\n";
    }
}   // destructor drains the queue and joins every worker`,
      },
      {
        label: "Go",
        language: "go",
        filename: "pool_demo.go",
        code: `package main

import (
	"fmt"
	"runtime"
	"sync"
	"time"
)

func main() {
	// The queue: a BUFFERED channel. Capacity 4 = bounded back-pressure.
	tasks := make(chan int, 4)
	results := make(chan string, 8)

	workers := runtime.NumCPU() // CPU-bound sizing; I/O-bound can be far higher
	var wg sync.WaitGroup

	// Create the workers ONCE; each loops forever over the same channel.
	for w := 1; w <= workers; w++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for task := range tasks { // blocks until a task arrives
				time.Sleep(20 * time.Millisecond)
				results <- fmt.Sprintf("task %d done by worker %d", task, id)
			}
		}(w)
	}

	// Submit: sending blocks once the buffer is full — that IS the back-pressure.
	for i := 1; i <= 8; i++ {
		tasks <- i
	}
	close(tasks) // graceful shutdown: workers exit when the channel drains

	wg.Wait()
	close(results)
	for r := range results {
		fmt.Println(r)
	}
	fmt.Printf("served 8 tasks with only %d goroutines\\n", workers)
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for a thread pool when..." },
      {
        type: "ul",
        items: [
          "**Many short tasks arrive continuously** — requests, messages, jobs. Creation cost dominates when each task is short, and a pool pays that cost once.",
          "**You need a hard ceiling on concurrency** — the pool size *is* the limit. It protects your own memory and, just as importantly, protects the database or downstream API from being hit by a thousand simultaneous callers.",
          "**Load is spiky** — the bounded queue absorbs bursts without spawning threads, and the rejection policy gives you a defined behaviour when even the queue fills.",
          "**You want tasks decoupled from threading** — plain `Runnable`s are trivially testable and let you swap the execution strategy (pool size, scheduled, same-thread) without touching the work itself.",
        ],
      },
      { type: "h", text: "Skip it when..." },
      {
        type: "ul",
        items: [
          "**There's one long-lived background job** — a dedicated thread is clearer than a pool of one.",
          "**Tasks block on each other** — if pooled tasks wait for other tasks in the same pool you're one step from starvation deadlock; use separate pools or restructure with [[producer-consumer]] style handoff.",
          "**Your runtime already gives you cheap threads** — with goroutines or Java virtual threads you can go thread-per-task and cap concurrency with a semaphore instead.",
          "**The work is trivially fast** — running a microsecond of work through a queue costs more in handoff than it saves.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Creation cost paid once — N threads for a million tasks instead of a million threads, so no OS call or ~1 MB stack per unit of work.",
        "Built-in concurrency limit — the pool size caps how much runs at once, protecting both your memory and every downstream system.",
        "Back-pressure by design — a bounded queue plus a rejection policy gives bursts a defined, survivable behaviour instead of a slow-motion OOM.",
        "Tasks decouple from threads — submit a Runnable and the executor decides where and when, which makes the work easy to test, reschedule and reuse.",
      ],
      cons: [
        "A blocked task removes a worker — one hung call without a timeout permanently shrinks the pool, and tasks waiting on the same pool can deadlock it entirely.",
        "Silent failures — exceptions from submit() are trapped inside the Future, so unchecked tasks can fail invisibly.",
        "Sizing is a guess until you measure — too few threads underuses the machine, too many thrash on context switches, and the right number differs per workload.",
        "Thread-local and per-thread state leaks between tasks, because the same thread is reused — stale ThreadLocals and unrestored context are a real source of bugs.",
      ],
    },

    furtherReading: [
      {
        label: "ExecutorService — Java SE API documentation",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html",
        note: "The canonical interface: submit, invokeAll, and the exact semantics of shutdown, shutdownNow and awaitTermination, including the standard graceful-shutdown snippet.",
        kind: "docs",
      },
      {
        label: "ThreadPoolExecutor — Java SE API documentation",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html",
        note: "Every knob explained in one page: core vs maximum pool size, keep-alive, queue choice (direct handoff / bounded / unbounded) and the four rejection policies.",
        kind: "docs",
      },
      {
        label: "Java Concurrency in Practice — Brian Goetz et al.",
        href: "https://jcip.net/",
        note: "Chapters 6–8 are the definitive treatment of task execution: pool sizing formulas, thread starvation deadlock, saturation policies and hidden thread-local state.",
        kind: "book",
      },
      {
        label: "A Guide to the Java ExecutorService — Baeldung",
        href: "https://www.baeldung.com/java-executor-service-tutorial",
        note: "Practical, runnable walkthrough of fixed, cached, single-threaded and scheduled pools, Futures, and the shutdown pitfalls — the fastest way from theory to working code.",
        kind: "article",
      },
      {
        label: "concurrent.futures — Python standard library docs",
        href: "https://docs.python.org/3/library/concurrent.futures.html",
        note: "Python's ThreadPoolExecutor and ProcessPoolExecutor: max_workers defaults, as_completed, and why exceptions only surface when you call result().",
        kind: "docs",
      },
      {
        label: "Go by Example: Worker Pools",
        href: "https://gobyexample.com/worker-pools",
        note: "The pool reduced to its essence — a buffered channel as the queue and a handful of goroutines ranging over it. Twenty lines that make the pattern obvious.",
        kind: "article",
      },
      {
        label: "JEP 444: Virtual Threads",
        href: "https://openjdk.org/jeps/444",
        note: "Why thread-per-task became viable again in Java 21, and the explicit guidance on when pools are still needed for limiting concurrency rather than limiting threads.",
        kind: "spec",
      },
    ],

    quiz: [
      {
        id: "thread-pools-and-executors-q1",
        question: "Why is creating a new thread for every task a problem under load?",
        options: [
          { id: "a", label: "Each thread costs an OS call and around 1 MB of stack, so thousands of tasks mean thousands of threads, heavy memory use and constant context switching." },
          { id: "b", label: "Threads can only be created once per program, so the second creation fails." },
          { id: "c", label: "The garbage collector cannot reclaim any thread, so memory grows even when threads finish." },
          { id: "d", label: "Threads created outside a pool are not allowed to perform I/O." },
        ],
        correctOptionId: "a",
        explanation:
          "Thread creation is a genuinely expensive OS operation and each thread reserves a large stack, so unbounded creation leads to memory exhaustion and thrashing — the classic 10 000 requests, 10 000 threads outage. There's no limit on how many times you may create threads (b), finished threads are reclaimed normally (c), and any thread may do I/O (d).",
      },
      {
        id: "thread-pools-and-executors-q2",
        question: "What makes a thread pool reuse its threads rather than recreate them?",
        options: [
          { id: "a", label: "Each worker runs an endless loop that takes the next task off a shared queue, runs it, and comes back for another — it never exits between tasks." },
          { id: "b", label: "The pool caches finished thread objects and calls start() on them a second time." },
          { id: "c", label: "The operating system automatically recycles any thread created inside an executor." },
          { id: "d", label: "Tasks are merged into one giant task that a single thread runs." },
        ],
        correctOptionId: "a",
        explanation:
          "The worker loop is the whole mechanism: take, run, repeat, blocking on an empty queue instead of terminating, so creation cost is paid once per worker. A Java thread cannot be restarted after it finishes (b), the OS has no notion of executors (c), and tasks stay separate and run concurrently across the workers (d).",
      },
      {
        id: "thread-pools-and-executors-q3",
        question: "Your tasks are mostly waiting on slow HTTP calls. How should you size the pool?",
        options: [
          { id: "a", label: "Considerably larger than the core count, because the threads spend most of their time blocked and using no CPU." },
          { id: "b", label: "Exactly one thread, since network calls must be serialised." },
          { id: "c", label: "Exactly the number of CPU cores, which is always the correct size." },
          { id: "d", label: "As large as possible with an unbounded queue, since more threads is always faster." },
        ],
        correctOptionId: "a",
        explanation:
          "I/O-bound threads are idle while waiting, so you need many in flight to keep the machine busy — roughly cores × (1 + wait/compute). One thread per core (c) is the rule for CPU-bound work, one thread total (b) throws away all the overlap, and unlimited threads (d) reintroduces the memory and context-switching problems the pool exists to prevent.",
      },
      {
        id: "thread-pools-and-executors-q4",
        question: "Why should a thread pool's task queue be bounded?",
        options: [
          { id: "a", label: "An unbounded queue lets the backlog grow without limit until memory runs out; a bound turns overload into visible back-pressure via a rejection policy." },
          { id: "b", label: "A bounded queue makes each individual task run faster." },
          { id: "c", label: "Unbounded queues are not supported by most standard libraries." },
          { id: "d", label: "Bounding the queue is what allows threads to be reused between tasks." },
        ],
        correctOptionId: "a",
        explanation:
          "With an unbounded queue, tasks arriving faster than they're finished simply pile up — you swap a thread explosion for a memory explosion, with latency quietly climbing. A bound makes the pool say 'I'm full' while still healthy. It doesn't change per-task speed (b), unbounded queues are the default in several libraries (c), and reuse comes from the worker loop, not the queue's size (d).",
      },
      {
        id: "thread-pools-and-executors-q5",
        question: "A task submitted with submit() throws an exception, but nothing is logged and the pool keeps running. Why?",
        options: [
          { id: "a", label: "submit() captures the exception inside the returned Future — it only surfaces when you call get() on that Future." },
          { id: "b", label: "Thread pools are designed to discard all exceptions permanently and cannot report them." },
          { id: "c", label: "The exception killed the worker thread, so the pool silently shrank by one." },
          { id: "d", label: "Exceptions inside pooled tasks are compile-time errors, so this cannot actually happen." },
        ],
        correctOptionId: "a",
        explanation:
          "submit() wraps the task so the failure is stored in the Future rather than propagated; ignore the Future and the failure is invisible. The exception is recoverable, not discarded (b) — call get() or wrap the task body in try/catch. The pool also replaces or protects its worker rather than shrinking silently (c), and this is a runtime, not compile-time, situation (d).",
      },
      {
        id: "thread-pools-and-executors-q6",
        question: "Tasks in a fixed pool of 4 each submit a sub-task to the same pool and then block waiting for its result. What happens?",
        options: [
          { id: "a", label: "Thread starvation deadlock — all four workers are blocked waiting, so no worker is left to run the sub-tasks, and the pool stops making progress forever." },
          { id: "b", label: "The pool automatically grows extra threads to run the sub-tasks." },
          { id: "c", label: "The sub-tasks run on the calling thread automatically, so it always completes." },
          { id: "d", label: "Nothing unusual — nested submissions are always safe in a fixed pool." },
        ],
        correctOptionId: "a",
        explanation:
          "Every worker is occupied waiting for work that only a worker could perform, so the pool deadlocks against itself — the classic starvation deadlock. A fixed pool does not grow (b) and only the caller-runs rejection policy makes the submitter execute a task, and only when the queue is full (c). Nested submission with blocking waits is a well-known hazard, not a safe pattern (d).",
      },
    ],
  },
};
