import type { RoadmapLesson } from "@/lib/content/types";

export const threadsAndLifecycle: RoadmapLesson = {
  title: "Threads & lifecycle",
  oneLiner:
    "A thread is one independent worker inside your program — many of them run in the same program, sharing the same memory. Think of a restaurant kitchen: the program is the kitchen, each thread is a cook, and the CPU cores are the stoves. Hiring a cook isn't the same as putting them on shift, being on shift isn't the same as standing at a stove, and the manager — not you — decides who cooks next. Learn those states and the rest of concurrency stops being magic.",
  difficulty: "beginner",
  estimatedTime: "12 min",
  prototypePath: "/prototypes/lld/threads-and-lifecycle.html",
  content: {
    prototypeCaption:
      "A **kitchen with two cooks and one stove**. Pick a cook card (👩‍🍳 *Cook-1* / 🧑‍🍳 *Cook-2*) — the buttons drive whoever is selected — then hit **▶ start()**: the lifecycle track lights up **NEW → RUNNABLE → RUNNING**, the 🔥 *core ×1* slot fills with that cook, and the caption reads `threads alive: 1 · on a core: 1`. Start the second cook and watch it park in the **ready queue** as RUNNABLE — ready, but there is only one stove. Press **⇄ Scheduler tick** to see the core change hands (you didn't choose who). **⏳ sleep(1s)** parks a cook in TIMED_WAITING and frees the stove; **🔒 wait for lock** parks it in BLOCKED until **✅ release**; **🏁 finish** ends it at TERMINATED. Press **▶ start()** on an already-started cook and the node flashes red: *IllegalThreadStateException*. Finally flip the **call** chip from `start()` to `run()` — now the button creates **no** worker at all: the core shows `🧵 main` doing the work and `threads alive` stays **0**.",

    overview: [
      {
        type: "p",
        text: "A **thread** is a single, independent path of execution inside a program — one worker that runs code line by line. Every program starts with exactly one: the *main* thread. Creating more threads means more work can be in flight at the same time. Here's the one-line difference from a **process**: a process is a whole running program with its *own* private memory, while threads live *inside* one process and **share** its memory — same variables, same objects, same heap. That sharing is what makes threads fast to create and talk to, and it's also the reason every hard concurrency bug exists.",
      },
      {
        type: "p",
        text: "Picture a **restaurant kitchen**. The kitchen is your program. Each **cook is a thread**, and every cook works from the same shared fridge and the same shared counter — that's shared memory. The **stoves are CPU cores**: no matter how many cooks you hire, only as many can *actually be cooking* as you have stoves. Hiring a cook is not the same as putting them on shift; being on shift is not the same as standing at a stove. A cook can be stuck waiting for the oven to free up, or taking a timed five-minute break, or finished for the day. Those situations are exactly the **lifecycle states** of a thread.",
      },
      {
        type: "p",
        text: "And here's the part beginners always trip on: **you don't decide who cooks when**. The operating system's **scheduler** does. It hands a core to one ready thread, takes it away a few milliseconds later, gives it to another — on its own schedule, for its own reasons. Your code says *what* each thread does; the scheduler says *when*. So any program whose correctness depends on \"thread A will surely get there before thread B\" is already broken; it just hasn't failed yet.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "`start()` creates a **new worker** that runs `run()` somewhere else; calling `run()` yourself is just an ordinary method call on the thread you're already on — **no** new worker, no concurrency at all.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You're already surrounded by threads",
        text: "Your web server handles each incoming request on a thread. Your phone app keeps a **UI thread** that must never block, which is why slow work is pushed to a background thread. A garbage collector, a logger flushing to disk, a timer firing callbacks — all threads. You have been writing multi-threaded programs for a while; you just weren't the one starting the threads.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The lifecycle: five states a thread moves through" },
      {
        type: "p",
        text: "A thread's whole life is a small state machine. Java names these states in the `Thread.State` enum, and the same shapes exist in every language:",
      },
      {
        type: "ul",
        items: [
          "**NEW** — the `Thread` object exists but nothing is running yet. The cook is *hired*, not on shift. No operating-system thread has been created at this point.",
          "**RUNNABLE** — started and eligible to run: it is either on a core right now or standing in the queue waiting for one. *This is the state beginners misread.* RUNNABLE means **ready**, not necessarily executing. Ten RUNNABLE threads on a four-core machine means at most four are truly moving.",
          "**RUNNING** — actually executing instructions on a core. (Java folds this into RUNNABLE, but it helps to picture it separately: cooks *at* a stove.) The count of RUNNING threads can never exceed the number of cores.",
          "**BLOCKED / WAITING / TIMED_WAITING** — alive but parked, using no CPU. **BLOCKED** = waiting to acquire a lock someone else holds. **WAITING** = parked indefinitely until another thread signals it (`join()`, `wait()`). **TIMED_WAITING** = parked with a deadline (`Thread.sleep(1000)`, `join(500)`, `await(2, SECONDS)`). A parked thread hands its core back — that's why blocking isn't \"burning CPU\".",
          "**TERMINATED** — `run()` returned (or threw). The shift is over, permanently. A terminated thread cannot be restarted, revived, or reused.",
        ],
      },
      { type: "h", text: "start() vs run() — the classic first mistake" },
      {
        type: "p",
        text: "`Thread` has a method called `run()` containing the work, and a method called `start()` that *launches* it. They look interchangeable and are absolutely not. `start()` asks the OS for a real new thread, which then calls `run()` **over there**. Calling `run()` yourself is a plain method call: the code executes **on your current thread**, top to bottom, before the next line runs. Nothing is concurrent, and no new thread was ever born — the biggest silent bug a beginner can ship.",
      },
      {
        type: "code",
        language: "java",
        filename: "StartVsRun.java",
        code: `Thread cook = new Thread(() -> System.out.println("cooking on " +
        Thread.currentThread().getName()));   // state: NEW

cook.run();     // prints "cooking on main"   ← just a method call, 1 lane
cook.start();   // prints "cooking on Thread-0" ← a REAL second worker
cook.start();   // 💥 IllegalThreadStateException — start() is one-shot

cook.join();    // the CALLING thread waits here until 'cook' is TERMINATED`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Ordering is never guaranteed",
        text: "Start Cook-1 then Cook-2 and you might see Cook-2's output first — every run can differ, and the version that \"works on my machine\" may fail on a busier or bigger machine. The scheduler is free to interleave threads at *any* instruction boundary. If you need ordering, you must create it explicitly with `join()`, a latch, a queue, or a lock. Never with `sleep()` and hope.",
      },
      { type: "h", text: "A Thread object is one-shot" },
      {
        type: "p",
        text: "Calling `start()` twice on the same `Thread` object throws `IllegalThreadStateException` — in Python it's a `RuntimeError`, in C++ starting a `std::thread` twice isn't even expressible. The reason is simple: `start()` is the transition *out of* NEW, and a thread that has left NEW can never return to it. If you want to do the work again, create a **new** `Thread` object (or, far better, hand the task to a pool). The task and the worker are different things: a `Runnable` is reusable, a `Thread` is not.",
      },
      { type: "h", text: "Waiting on purpose: join() and sleep()" },
      {
        type: "ul",
        items: [
          "**`t.join()`** — *\"I'll wait here until thread `t` finishes.\"* Note who waits: the **calling** thread parks in WAITING, not `t`. This is the standard way `main` avoids exiting while its workers are still plating dishes, and the standard way to collect results before moving on.",
          "**`Thread.sleep(ms)`** — parks the *current* thread in TIMED_WAITING for at least that long, then it becomes RUNNABLE again. Two catches: *at least* is not *exactly* (it must still wait for a core after waking), and sleeping is **not** a synchronization tool — it does not release any lock it holds and it does not make a race condition go away.",
          "**Interruption** — `t.interrupt()` is a polite request, not a kill. It makes a sleeping or waiting thread throw `InterruptedException`; a thread busy computing simply sees a flag. There is no safe way to force-stop a thread, which is why `Thread.stop()` was deprecated decades ago.",
        ],
      },
      { type: "h", text: "Daemon vs user threads, in one line" },
      {
        type: "p",
        text: "A **user thread** keeps the program alive: the JVM exits only when the last one finishes. A **daemon thread** (`t.setDaemon(true)`, before `start()`) is background help — a metrics flusher, a cache cleaner — and the program will exit right out from under it without waiting. Rule of thumb: if losing the work mid-way would be a bug, it must be a **user** thread.",
      },
      { type: "h", text: "Why you rarely write `new Thread(...)` today" },
      {
        type: "p",
        text: "Raw threads are expensive: each one costs the OS a stack (often ~1 MB) and a scheduling slot, creation takes real time, and a request-per-thread design collapses under load — thousands of cooks in a kitchen with eight stoves spend all their time bumping into each other (that's **context switching**). So in production you almost never hire a cook per dish. You keep a small permanent crew and feed them a queue of tasks: an `ExecutorService` in Java, a `ThreadPoolExecutor` in Python, a worker pool in C++. Threads become *reused workers* instead of one-shot objects — which is exactly the next lesson, **Thread pools**.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Threads aren't always OS threads",
        text: "Go's **goroutines** and Java 21's **virtual threads** are lightweight threads managed by the runtime, multiplexed onto a few real OS threads. They cost kilobytes instead of megabytes, so a million of them is fine. The lifecycle picture you just learned still applies — created, runnable, running, parked, done — only the price tag changed.",
      },
    ],

    handsOn: [
      {
        title: "01 · Hire a cook and put them on shift",
        body: "With the call chip on start(), make sure 👩‍🍳 Cook-1 is selected and press ▶ start(). The track lights NEW, then RUNNABLE, then RUNNING; the 🔥 core ×1 slot fills with 'Cook-1 · RUNNING' and the caption reads threads alive: 1 · on a core: 1. Now press ▶ start() again on the same cook: the node flashes red with 'start() twice ✗ IllegalThreadStateException'. One Thread object, one start — ever.",
      },
      {
        title: "02 · Two cooks, one stove",
        body: "Click the 🧑‍🍳 Cook-2 card and press ▶ start(). It does not begin cooking — its chip reads RUNNABLE and it appears in the ready queue, because the single core is taken. That is the whole meaning of RUNNABLE: ready, not running. Press ⇄ Scheduler tick a few times and watch the core change hands; you never chose who. Then select the cook holding the core and try ⏳ sleep(1s) (TIMED_WAITING, core handed over, wakes on its own), 🔒 wait for lock followed by ✅ release (note it returns to the queue, not straight to the stove), and 🏁 finish for TERMINATED.",
      },
      {
        title: "03 · The run() trap",
        body: "Hit ↺ Reset, then flip the call chip from start() to run() and press ▶ run(). Nothing enters the lifecycle: Cook-1's chip stays NEW, threads alive stays 0, and the core slot shows '🧵 main · doing Cook-1's work'. One lane, zero concurrency — run() is just a method call. Flip back to start() and press it again to see a real second lane appear.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "Kitchen.java",
        code: `public class Kitchen {

    // The TASK (a Runnable) is not the WORKER (a Thread). Tasks are reusable.
    static Runnable cook(String name, int dishes) {
        return () -> {
            for (int i = 1; i <= dishes; i++) {
                System.out.println(name + " plated dish " + i);
                try {
                    Thread.sleep(100);          // TIMED_WAITING: gives the core back
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();  // restore the flag, then stop
                    return;
                }
            }
        };
    }

    public static void main(String[] args) throws InterruptedException {
        Thread c1 = new Thread(cook("Cook-1", 3), "Cook-1");   // state: NEW
        Thread c2 = new Thread(cook("Cook-2", 3), "Cook-2");   // state: NEW
        // c2.setDaemon(true);   // background help: would NOT keep the JVM alive

        c1.start();      // NEW -> RUNNABLE: a real second worker exists
        c2.start();
        // c1.run();     // would run the task on MAIN — no new thread at all
        // c1.start();   // IllegalThreadStateException — start() is one-shot

        c1.join();       // MAIN parks in WAITING until Cook-1 is TERMINATED
        c2.join();

        // Output order between the two cooks changes from run to run.
        System.out.println("closed; Cook-1 is " + c1.getState());  // TERMINATED
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "kitchen.py",
        code: `import threading
import time


def cook(name: str, dishes: int) -> None:
    for i in range(1, dishes + 1):
        print(f"{name} plated dish {i}")
        time.sleep(0.1)            # timed wait: hands the core back


c1 = threading.Thread(target=cook, args=("Cook-1", 3), name="Cook-1")  # NEW
c2 = threading.Thread(target=cook, args=("Cook-2", 3), name="Cook-2")  # NEW
# c2.daemon = True   # background help: dies when the main thread exits

c1.start()      # NEW -> alive: a real OS thread now runs cook()
c2.start()
# c1.run()      # would run cook() on the MAIN thread — no new worker
# c1.start()    # RuntimeError: threads can only be started once

c1.join()       # main blocks here until Cook-1 finishes
c2.join()

# Interleaving differs every run — the OS scheduler decides.
print("closed; Cook-1 alive?", c1.is_alive())      # False = TERMINATED`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "kitchen.cpp",
        code: `#include <chrono>
#include <iostream>
#include <string>
#include <thread>

void cook(const std::string& name, int dishes) {
    for (int i = 1; i <= dishes; ++i) {
        std::cout << name << " plated dish " << i << "\\n";
        // timed wait: parks this thread and frees the core
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

int main() {
    // A std::thread is constructed AND started in one step — there is no
    // "NEW but not started" state to get wrong, and no way to start twice.
    std::thread c1(cook, "Cook-1", 3);
    std::thread c2(cook, "Cook-2", 3);

    // cook("Cook-1", 3);   // a plain call = run(): main does the work itself

    std::cout << "hardware threads: "
              << std::thread::hardware_concurrency() << "\\n";  // ~core count

    c1.join();   // main waits until Cook-1 finishes
    c2.join();   // EVERY joinable thread must be joined or detached, or
                 // ~thread() calls std::terminate() and kills the program
    std::cout << "closed\\n";
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "kitchen.go",
        code: `package main

import (
	"fmt"
	"sync"
	"time"
)

func cook(name string, dishes int, wg *sync.WaitGroup) {
	defer wg.Done() // like join(): announces "this worker is finished"
	for i := 1; i <= dishes; i++ {
		fmt.Println(name, "plated dish", i)
		time.Sleep(100 * time.Millisecond) // parks the goroutine, frees the core
	}
}

func main() {
	var wg sync.WaitGroup
	wg.Add(2)

	go cook("Cook-1", 3, &wg) // "go" == start(): a new lightweight worker
	go cook("Cook-2", 3, &wg)
	// cook("Cook-1", 3, &wg) // no "go" == run(): main does the work itself

	// Goroutines cost ~2 KB of stack, so thousands are normal — but the
	// lifecycle is the same: created, runnable, running, parked, done.
	wg.Wait() // main blocks until both cooks are done
	fmt.Println("closed")
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Start a thread when..." },
      {
        type: "ul",
        items: [
          "**Something slow must not freeze everything else** — a network call, a file read, a long computation. Move it off the UI or request thread so the rest of the program stays responsive.",
          "**Independent work can overlap** — several downloads, several files to parse. If the pieces don't depend on each other, more workers means less wall-clock time.",
          "**You need real parallel CPU work** — genuinely splitting a big computation across cores. Note: on multi-core machines this is real speed-up; in CPython the GIL means CPU-bound work needs *processes*, not threads.",
        ],
      },
      { type: "h", text: "Don't hand-roll threads when..." },
      {
        type: "ul",
        items: [
          "**There will be many short tasks** — creating a thread per task is pure overhead. Use a pool (`ExecutorService`, `ThreadPoolExecutor`) and reuse a small crew.",
          "**The work is trivially fast** — starting a thread costs more than the work saves. Just call the method.",
          "**You'd use `sleep()` to get the ordering right** — that's a race condition with a timer taped over it. Use `join()`, a latch, a queue, or a lock.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Responsiveness — slow work moves off the main or UI thread, so the program keeps reacting instead of freezing.",
        "Real parallelism — independent work spreads across cores, cutting wall-clock time on multi-core machines.",
        "Cheap sharing — threads live in one process and share memory, so passing data between them needs no copying or serialization.",
        "Natural fit for blocking I/O — a thread parked on a socket costs no CPU while it waits, and wakes up right when the data arrives.",
      ],
      cons: [
        "Shared memory means shared bugs — races, torn reads, deadlocks and visibility problems all come from the same sharing that makes threads fast.",
        "Non-determinism — the scheduler interleaves threads differently every run, so bugs appear rarely and vanish under a debugger.",
        "Expensive at scale — each OS thread costs a stack (~1 MB) plus scheduling; thousands of them thrash the CPU with context switches.",
        "One-shot and unmanaged — a raw Thread can't be restarted, cancelled safely, rate-limited or reused, which is why pools exist.",
      ],
    },

    furtherReading: [
      {
        label: "Thread (Java SE 21 API) — Oracle",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html",
        note: "The authoritative source: start(), run(), join(), sleep(), interrupt(), daemon threads, and the Thread.State enum listing every lifecycle state by name.",
        kind: "docs",
      },
      {
        label: "Creating and Starting Java Threads — Jenkov",
        href: "https://jenkov.com/tutorials/java-concurrency/creating-and-starting-threads.html",
        note: "The clearest beginner walkthrough of start() vs run(), including the exact mistake of calling run() and wondering why nothing is concurrent.",
        kind: "article",
      },
      {
        label: "Life Cycle of a Thread in Java — Baeldung",
        href: "https://www.baeldung.com/java-thread-lifecycle",
        note: "Each state (NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED) with a tiny runnable program that actually prints the thread in that state.",
        kind: "article",
      },
      {
        label: "threading — Thread-based parallelism (Python docs)",
        href: "https://docs.python.org/3/library/threading.html",
        note: "Python's side of the same model: start(), join(), daemon threads, and the explicit note that start() may be called at most once per thread object.",
        kind: "docs",
      },
      {
        label: "std::thread — cppreference",
        href: "https://en.cppreference.com/w/cpp/thread/thread",
        note: "C++ threads start on construction, and any joinable thread must be joined or detached before destruction — the one lifecycle rule C++ enforces with std::terminate.",
        kind: "docs",
      },
      {
        label: "Effective Go — Goroutines",
        href: "https://go.dev/doc/effective_go#goroutines",
        note: "How a runtime-managed lightweight thread differs from an OS thread, and why 'go f()' versus 'f()' is exactly the start() versus run() distinction.",
        kind: "docs",
      },
      {
        label: "Concurrency is not Parallelism — Rob Pike (talk)",
        href: "https://go.dev/blog/waza-talk",
        note: "A 30-minute video that fixes the single most common confusion in this topic: structuring work as independent threads is not the same thing as running it simultaneously.",
        kind: "video",
      },
      {
        label: "Java Concurrency in Practice — Goetz et al.",
        href: "https://jcip.net/",
        note: "The standard book. Chapters on thread creation, safe cancellation and interruption explain why raw threads give way to executors in real systems.",
        kind: "book",
      },
    ],

    quiz: [
      {
        id: "threads-and-lifecycle-q1",
        question: "What is the difference between calling `t.start()` and calling `t.run()`?",
        options: [
          { id: "a", label: "start() creates a new thread that executes run(); calling run() directly just executes the code on the current thread — no new thread exists." },
          { id: "b", label: "They do the same thing; start() is only a more modern alias for run()." },
          { id: "c", label: "run() creates the thread and start() schedules it, so you must call both in that order." },
          { id: "d", label: "start() runs the task immediately, while run() queues it to run later." },
        ],
        correctOptionId: "a",
        explanation:
          "start() asks the OS for a real new worker, which then calls run() over there — that is the only way to get concurrency. Calling run() yourself is an ordinary method call that finishes on your current thread before the next line executes, which is why (b) is wrong and (c) is backwards. Nothing is queued for later either, so (d) is wrong: with run() the work happens right now, in your own lane.",
      },
      {
        id: "threads-and-lifecycle-q2",
        question: "A thread's state is RUNNABLE. What does that actually tell you?",
        options: [
          { id: "a", label: "It is eligible to run — either on a core now, or waiting in the queue for the scheduler to give it one." },
          { id: "b", label: "It is definitely executing instructions on a CPU core right now." },
          { id: "c", label: "It has been created but start() has not been called yet." },
          { id: "d", label: "It is blocked waiting for a lock held by another thread." },
        ],
        correctOptionId: "a",
        explanation:
          "RUNNABLE means ready, not necessarily running: on a machine with one core, ten RUNNABLE threads means one is executing and nine are queued. That rules out (b) — the number actually executing can never exceed the core count. (c) describes NEW, the state before start(), and (d) describes BLOCKED, where the thread is parked and consuming no CPU at all.",
      },
      {
        id: "threads-and-lifecycle-q3",
        question: "You call `t.start()`, the thread finishes its work, and later you call `t.start()` again on the same object. What happens?",
        options: [
          { id: "a", label: "It throws IllegalThreadStateException — a Thread object can be started only once and can never return to NEW." },
          { id: "b", label: "The thread restarts and runs its task a second time." },
          { id: "c", label: "The second call is silently ignored and the program continues." },
          { id: "d", label: "It runs the task again, but on the calling thread instead of a new one." },
        ],
        correctOptionId: "a",
        explanation:
          "start() is the one-way transition out of NEW, and a TERMINATED thread cannot go back, so the second call throws (a RuntimeError in Python). It neither restarts (b) nor fails quietly (c) — quiet failure would hide real bugs. (d) describes what run() does, not start(). To do the work again, build a new Thread object or hand the task to a pool.",
      },
      {
        id: "threads-and-lifecycle-q4",
        question: "In `main`, you write `worker.join()`. Which thread waits, and until when?",
        options: [
          { id: "a", label: "The calling thread (main) parks until worker reaches TERMINATED." },
          { id: "b", label: "The worker thread pauses until main is ready for it." },
          { id: "c", label: "Both threads pause until the scheduler wakes them together." },
          { id: "d", label: "Neither waits — join() just merges the two threads' output streams." },
        ],
        correctOptionId: "a",
        explanation:
          "join() is 'I will wait here until that thread is done', so the waiter is whoever called it — main goes into WAITING while worker keeps running normally, which rules out (b) and (c). It is the standard way to stop main from exiting or reading results too early. (d) is a made-up meaning: join() has nothing to do with output streams.",
      },
      {
        id: "threads-and-lifecycle-q5",
        question: "You start Cook-1 and then Cook-2, and each prints its name. Is Cook-1's line guaranteed to print first?",
        options: [
          { id: "a", label: "No — the OS scheduler decides who runs when, so the order can differ on every run and every machine." },
          { id: "b", label: "Yes — threads run in the exact order start() was called." },
          { id: "c", label: "Yes, as long as both threads are the same priority." },
          { id: "d", label: "Only if you add a short Thread.sleep() between the two start() calls." },
        ],
        correctOptionId: "a",
        explanation:
          "start() only makes a thread RUNNABLE; the scheduler independently decides which RUNNABLE thread gets a core and can switch between them at almost any point, so (b) and (c) are false — priorities are hints, not guarantees. (d) is the classic trap: sleep() makes one ordering more likely on your laptop but guarantees nothing on a busier machine. Real ordering needs join(), a latch, a queue or a lock.",
      },
      {
        id: "threads-and-lifecycle-q6",
        question: "What is the key difference between a process and a thread?",
        options: [
          { id: "a", label: "A process has its own private memory; threads live inside one process and share its memory — which is what makes data races possible." },
          { id: "b", label: "A thread is just a slower process, so threads are used only on old hardware." },
          { id: "c", label: "Threads each get their own private heap, so they can never interfere with one another." },
          { id: "d", label: "A process can use only one CPU core, while a thread can use many at once." },
        ],
        correctOptionId: "a",
        explanation:
          "Threads are workers inside one program sharing the same heap and objects, which makes them cheap to create and communicate with — and makes shared-state bugs possible. (c) inverts this: threads share the heap (only their call stacks are private), which is precisely why locks exist. Threads are lighter, not slower (b), and a multi-threaded process can absolutely use many cores, so (d) is backwards.",
      },
    ],
  },
};
