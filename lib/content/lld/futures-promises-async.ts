import type { RoadmapLesson } from "@/lib/content/types";

export const futuresPromisesAsync: RoadmapLesson = {
  title: "Futures, Promises & async",
  oneLiner:
    "A **Future** is a receipt for a value that doesn't exist yet. You ask for something slow, and instead of standing there waiting, you get a placeholder object *immediately* — the real value drops into it later. Think of the buzzer a coffee shop hands you: you order, take the buzzer, go sit down and do other things, and when it flashes your drink is ready. Async programming is just that idea applied to network calls, disk reads and database queries.",
  difficulty: "intermediate",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/futures-promises-async.html",
  content: {
    prototypeCaption:
      "A **timeline of three 300 ms calls** — `fetchPrice`, `fetchStock`, `fetchReviews` — with a 🧵 *Main thread* lane above them. Start in **⛔ Blocking get()** and press **▶ Run**: the three bars draw *end to end* (0 → 300 → 600 → 900) while the main-thread lane is one long amber **BLOCKED in get()** bar, and the readouts land on `total: 900 ms` and `main thread blocked: 900 ms` in red. Now flip to **⚡ Async .then()** and press **▶ Run** again: the same three bars fire *stacked in parallel*, the main-thread lane stays green with little `✔` other-work ticks, and the readouts read `total: 300 ms` and `main thread blocked: 0 ms`. Watch the 🧾 **Future&lt;Price&gt;** card: it appears at t = 0 as `PENDING ⋯` — the receipt — and only flips to `COMPLETED ✓ $42.10` at t = 300. Turn on **⚠️ Fail** to make `fetchPrice` time out: its bar turns red, the card reads `FAILED ✗ timeout`, `.then(show)` is skipped and `.catch(err)` lights up. **🔗 then chain** makes `fetchStock` wait for `fetchPrice`, so the total stretches back out — dependent work can't overlap.",

    overview: [
      {
        type: "p",
        text: "Some things are slow: a network call, a database query, reading a file. The naive way to write them is *stop and wait* — your thread sits there, doing absolutely nothing, until the answer comes back. A **Future** (also called a *promise*, a *task*, or a *deferred*) is the fix. Instead of the value, the slow call hands you back a small object **immediately**: an empty box with a label saying *\"the answer will be in here later\"*. You can carry that box around, hand it to other code, or say what should happen once it fills up — all without your thread standing still.",
      },
      {
        type: "p",
        text: "The everyday version is the **coffee shop buzzer**. You order a latte. The barista doesn't make you stand at the counter staring at the machine — they hand you a buzzer and take the next order. The buzzer isn't your coffee; it's a *claim* on a coffee that will exist in three minutes. You go sit down, open your laptop, answer an email. When the buzzer flashes, you walk up and collect. The buzzer is the Future. Sitting down and doing other work is **async**. And standing at the counter watching the barista? That's calling `get()` the instant you get the buzzer — technically legal, completely pointless.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "A Future is a **placeholder handed to you now for a value that arrives later**. It starts `PENDING` and settles exactly once — either `COMPLETED` with a value or `FAILED` with an error — and it never changes again. The whole benefit comes from what you do *between* getting the Future and reading it.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already used one",
        text: "Every JavaScript `fetch()` returns a **Promise** — the same idea, different name. `await fetch(url)` is you saying *\"pause this function until the buzzer flashes, but let the thread go do other things meanwhile.\"* Java calls it `CompletableFuture`, Python calls it an *awaitable* / `asyncio.Task`, C# calls it `Task<T>`, and Go doesn't name it at all — a goroutine writing to a channel *is* the future.",
      },
    ],

    howItWorks: [
      { type: "h", text: "Three states, settled once" },
      {
        type: "p",
        text: "A Future is a tiny state machine with exactly three states, and it moves through them **once**:",
      },
      {
        type: "ul",
        items: [
          "**PENDING** — the default. The work is in flight; the box is empty. Anyone who asks for the value now has to wait.",
          "**COMPLETED** — the work finished and the value is in the box. Reading it is instant from now on, forever, for everyone.",
          "**FAILED** — the work threw. The box holds an *error* instead of a value, and reading it re-throws that error at you.",
        ],
      },
      {
        type: "p",
        text: "The word for \"reached COMPLETED or FAILED\" is **settled**. Settling is a one-way door: a Future never goes back to pending, and never settles twice. That immutability is what makes Futures safe to share — ten different pieces of code can hold the same Future and they all see the same single result.",
      },
      { type: "h", text: "Future vs Promise: the read side and the write side" },
      {
        type: "p",
        text: "These two words get used interchangeably, but classically they name the **two ends of the same box**. The **Future** is the *read side* — what the caller holds, the thing you wait on or attach callbacks to; it has no way to set a value. The **Promise** is the *write side* — what the producer holds, the thing with `complete(value)` and `completeExceptionally(error)` on it. Whoever is doing the work fulfils the promise; whoever is waiting reads the future.",
      },
      {
        type: "p",
        text: "Languages split this differently. C++ is explicit: `std::promise` (producer) hands out a `std::future` (consumer). Java's `CompletableFuture` *merges* both roles into one class, which is why it can both be awaited and be completed by hand. JavaScript's `Promise` is confusingly named — it's actually the read side; the write side is the `resolve`/`reject` pair passed into the constructor. Same mechanism every time: one end writes once, the other end reads.",
      },
      { type: "h", text: "The whole point is overlap" },
      {
        type: "p",
        text: "Here's the mistake everybody makes first. You submit three tasks, and then immediately call `get()` on each one inside the loop:",
      },
      {
        type: "code",
        language: "java",
        code: `// ❌ The classic beginner mistake — serial code with extra steps
for (String id : ids) {
    Future<Price> f = executor.submit(() -> fetchPrice(id)); // starts...
    Price p = f.get();          // ...and we immediately stand there waiting
    total += p.amount();        // 3 × 300 ms = 900 ms
}

// ✅ Submit everything FIRST, then collect — the waits overlap
List<Future<Price>> futures = new ArrayList<>();
for (String id : ids) {
    futures.add(executor.submit(() -> fetchPrice(id))); // all in flight now
}
for (Future<Price> f : futures) {
    total += f.get(2, TimeUnit.SECONDS).amount();       // ≈ 300 ms in total
}`,
      },
      {
        type: "p",
        text: "Both versions use Futures. Only the second one is *faster*. `get()` **blocks** — it parks the calling thread until the Future settles — so calling it right after you submit hands back all the benefit you just bought. The gain isn't the Future object; it's the **overlap** you create in the gap between submitting and reading. Three 300 ms calls that wait *at the same time* finish in roughly 300 ms, because you're waiting on the network, not on the CPU, and waiting is something you can do in parallel for free.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The gotcha: submit-then-get() in a loop",
        text: "If your code reads `submit(...)` immediately followed by `.get()` inside the same loop iteration, you have written **synchronous code with a thread pool attached** — all the complexity, none of the speed. Fire every independent call first, keep the Futures in a list, and only then start collecting. In the prototype this is the entire ⛔ *Blocking* vs ⚡ *Async* contrast: 900 ms versus 300 ms for identical work.",
      },
      { type: "h", text: "Callbacks and chaining: say what happens next" },
      {
        type: "p",
        text: "Blocking on `get()` is the crude way to read a Future. The good way is to **attach a continuation**: tell the Future what to run once it settles, and walk away without holding a thread hostage. `thenApply` (Java), `.then` (JavaScript) and `await` (Python, C#, JS) all do this. Chaining then gives you two composition moves:",
      },
      {
        type: "ul",
        items: [
          "**Transform / sequence** — `thenApply(fn)` maps the value; `thenCompose(fn)` runs *another* Future afterwards (JS: returning a promise from `.then`). This is genuinely dependent work — call B needs call A's result — so it **can't** overlap, and the total time is the sum. That's the 🔗 *then chain* chip in the prototype.",
          "**Combine / fan-in** — `CompletableFuture.allOf(a, b, c)` (Java), `Promise.all([a, b, c])` (JS), `asyncio.gather(...)` (Python), a `sync.WaitGroup` or a channel drain (Go). These are *independent* calls, so they overlap and the total is the **slowest one**, not the sum.",
        ],
      },
      { type: "h", text: "Errors travel down the chain" },
      {
        type: "p",
        text: "When a Future fails, the error doesn't get thrown where you attached the callback — that code already returned long ago. Instead the failure **propagates down the chain**: every `thenApply` after it is skipped, and the error keeps sliding until something catches it (`exceptionally` / `handle` in Java, `.catch` in JS, `try/except` around `await` in Python). If nothing catches it, the error is stored inside the last Future and *silently disappears* — no stack trace, no crash, just a value that never shows up. Node calls this an unhandled rejection; Java calls it a Future nobody joined. Both are nasty to debug.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "A Future you never read can swallow an exception whole",
        text: "Fire-and-forget async work is where bugs go to hide. If you don't `join()`, `await`, or attach a `.catch()`, a failure inside that task may never surface anywhere. Always terminate a chain with an error handler — even if that handler only logs.",
      },
      { type: "h", text: "Timeouts and cancellation" },
      {
        type: "p",
        text: "Never wait forever on something that talks to a network. Every Future API gives you a bounded wait — `f.get(2, TimeUnit.SECONDS)`, `asyncio.wait_for(coro, timeout=2)`, `future.wait_for(2s)` in C++, `select` with `context.WithTimeout` in Go. And when you no longer need a result — the user closed the page, a sibling call already failed — **cancel** it: `future.cancel(true)`, `task.cancel()`, `AbortController`, a cancelled `context.Context`. Cancellation is cooperative almost everywhere: it sets a flag or fires an interrupt, and the task has to notice and stop. A timeout without a cancel just means you stopped waiting while the work keeps burning resources.",
      },
      { type: "h", text: "Callback hell vs async/await" },
      {
        type: "p",
        text: "Early callback-based code nested every step inside the previous step's handler, and three or four levels in it became an unreadable staircase — *callback hell*. `async`/`await` fixes the *reading* problem: `var price = await fetchPrice();` looks like a plain blocking line, but the compiler chops the function in half at that `await`, returns control to the runtime, and resumes the rest when the Future settles. It's the same Futures and callbacks underneath; you just get to write it top to bottom, with normal `try/catch` and normal loops.",
      },
      {
        type: "callout",
        variant: "info",
        title: "async ≠ more threads",
        text: "This is the single most misunderstood part. Async isn't about *adding* threads — it's about **not blocking a thread while waiting**. A blocked thread costs memory (a whole stack) and does zero work. An event loop on **one** thread can hold thousands of pending I/O operations at once, because each one is just a small entry in a table saying *'when this socket is ready, resume here.'* That's how Node.js serves thousands of concurrent connections on one thread. Async buys you *concurrency* (many things in flight); threads buy you *parallelism* (many things computing at once). For CPU-bound work you still need threads.",
      },
      { type: "h", text: "How the four languages spell it" },
      {
        type: "ul",
        items: [
          "**Java** — `Future<T>` is the old, blocking-only interface (`get()`, `cancel()`); `CompletableFuture<T>` adds `thenApply` / `thenCompose` / `allOf` / `exceptionally`. Since Java 21, **virtual threads** offer an alternative: write plain blocking code and let the JVM park the cheap virtual thread instead of an OS thread.",
          "**Python** — `asyncio` with `async def`, `await`, `asyncio.gather(...)` and `asyncio.wait_for(...)`, all on a single-threaded event loop; `concurrent.futures` gives thread-pool `Future` objects for the blocking style.",
          "**C++** — `std::future` / `std::promise` / `std::async`, plus `wait_for` for timeouts. `get()` moves the value out and re-throws any stored exception; C++20 coroutines add `co_await` on top.",
          "**Go** — has no Future type on purpose. You launch a **goroutine** and give it a channel; the channel *is* the future, and receiving from it *is* the `get()`. `sync.WaitGroup` is your `allOf`, and `context.Context` carries the timeout and cancellation.",
        ],
      },
    ],

    handsOn: [
      {
        title: "01 · Watch get() waste 900 ms",
        body: "Leave the toggle on ⛔ Blocking get() and press ▶ Run. The three ☕ bars draw one after another — 0–300, 300–600, 600–900 — while the 🧵 Main thread lane fills with a single amber ⏸ BLOCKED in get() bar for the entire time. The readouts settle on total: 900 ms and main thread blocked: 900 ms in red. That's submit-then-get() in a loop: three Futures, zero overlap.",
      },
      {
        title: "02 · Flip to async and watch them stack",
        body: "Click ⚡ Async .then() and press ▶ Run again. The same three bars now start together at t = 0 and finish at 300 — total: 300 ms, main thread blocked: 0 ms in green, and the main lane shows ✔ other-work ticks instead of a blocked bar. Now watch the 🧾 Future<Price> card: it appears at t = 0 reading PENDING ⋯ (that's your buzzer) and only flips to COMPLETED ✓ $42.10 at t = 300, when .then(show) lights up. Receipt now, value later.",
      },
      {
        title: "03 · Break it, then chain it",
        body: "Turn on ⚠️ Fail and run: fetchPrice's bar goes red, the card reads FAILED ✗ timeout, .then(show) is skipped and .catch(err) lights up — the error slid down the chain to the only thing that could handle it. Now switch ⚠️ Fail off, turn on 🔗 then chain and run: fetchStock no longer starts at 0, it waits for fetchPrice to settle and the total stretches to 600 ms. Dependent work can't overlap. ↺ Reset puts everything back.",
      },
    ],

    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "PriceService.java",
        code: `import java.util.concurrent.*;
import java.util.List;

public class PriceService {

    // Each of these takes ~300 ms of pure waiting (network).
    static String fetchPrice()   { sleep(300); return "$42.10"; }
    static String fetchStock()   { sleep(300); return "12 left"; }
    static String fetchReviews() { sleep(300); return "4.6 stars"; }

    public static void main(String[] args) throws Exception {

        // ❌ BLOCKING: get() right after submit = serial. ~900 ms.
        ExecutorService pool = Executors.newFixedThreadPool(4);
        long t0 = System.currentTimeMillis();
        String p1 = pool.submit(PriceService::fetchPrice).get();   // blocks here
        String s1 = pool.submit(PriceService::fetchStock).get();   // ...and here
        String r1 = pool.submit(PriceService::fetchReviews).get(); // ...and here
        System.out.println("blocking: " + (System.currentTimeMillis() - t0) + " ms");

        // ✅ ASYNC: fire everything first, THEN combine. ~300 ms.
        long t1 = System.currentTimeMillis();
        CompletableFuture<String> price   = CompletableFuture.supplyAsync(PriceService::fetchPrice, pool);
        CompletableFuture<String> stock   = CompletableFuture.supplyAsync(PriceService::fetchStock, pool);
        CompletableFuture<String> reviews = CompletableFuture.supplyAsync(PriceService::fetchReviews, pool);
        // 'price' is the RECEIPT — it exists now, the value lands later.

        CompletableFuture<String> card = price
            .thenApply(v -> "Price: " + v)          // runs AFTER it settles, blocks nobody
            .exceptionally(err -> "Price unavailable");  // errors slide down to here

        CompletableFuture.allOf(price, stock, reviews).join();   // fan-in: waits for the SLOWEST
        System.out.println("async: " + (System.currentTimeMillis() - t1) + " ms");
        System.out.println(card.get(2, TimeUnit.SECONDS));       // ALWAYS bound the wait

        // Dependent work can't overlap — thenCompose sequences it.
        CompletableFuture<String> shipping = price.thenCompose(v ->
            CompletableFuture.supplyAsync(() -> "ship for " + v, pool));
        System.out.println(shipping.join());

        // No longer need a result? Cancel it (cooperative: interrupts the worker).
        CompletableFuture<String> slow = CompletableFuture.supplyAsync(PriceService::fetchReviews, pool);
        slow.cancel(true);
        System.out.println("cancelled: " + slow.isCancelled());

        pool.shutdown();
    }

    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "price_service.py",
        code: `import asyncio
import time


# Each of these is ~300 ms of pure waiting — perfect for async.
async def fetch_price() -> str:
    await asyncio.sleep(0.3)
    return "$42.10"


async def fetch_stock() -> str:
    await asyncio.sleep(0.3)
    return "12 left"


async def fetch_reviews() -> str:
    await asyncio.sleep(0.3)
    raise TimeoutError("reviews service timed out")   # this one fails


async def main() -> None:
    # ❌ BLOCKING style: await each call before starting the next → ~900 ms.
    t0 = time.perf_counter()
    await fetch_price()
    await fetch_stock()
    print(f"serial: {time.perf_counter() - t0:.2f}s")

    # ✅ ASYNC: create_task hands back the RECEIPT immediately; work starts now.
    t1 = time.perf_counter()
    price = asyncio.create_task(fetch_price())      # pending Future, not a value
    stock = asyncio.create_task(fetch_stock())
    reviews = asyncio.create_task(fetch_reviews())

    # ...do other work here while all three wait in parallel...

    # gather = allOf: overlaps, so the total is the SLOWEST, not the sum.
    results = await asyncio.gather(price, stock, reviews, return_exceptions=True)
    print(f"parallel: {time.perf_counter() - t1:.2f}s -> {results}")

    # Errors propagate: handle them or they vanish silently.
    try:
        await fetch_reviews()
    except TimeoutError as e:
        print(f"caught: {e}")            # the .catch() of the Python world

    # Never wait forever on a network call — bound it, then cancel.
    slow = asyncio.create_task(fetch_price())
    try:
        await asyncio.wait_for(slow, timeout=0.1)
    except asyncio.TimeoutError:
        print("timed out; task cancelled:", slow.cancelled())


asyncio.run(main())`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "price_service.cpp",
        code: `#include <chrono>
#include <future>
#include <iostream>
#include <stdexcept>
#include <string>
#include <thread>

using namespace std::chrono_literals;

std::string fetchPrice()   { std::this_thread::sleep_for(300ms); return "$42.10"; }
std::string fetchStock()   { std::this_thread::sleep_for(300ms); return "12 left"; }
std::string fetchReviews() { std::this_thread::sleep_for(300ms); throw std::runtime_error("timeout"); }

int main() {
    // ✅ std::async launches now and hands back a FUTURE — the receipt.
    auto t0 = std::chrono::steady_clock::now();
    std::future<std::string> price   = std::async(std::launch::async, fetchPrice);
    std::future<std::string> stock   = std::async(std::launch::async, fetchStock);
    std::future<std::string> reviews = std::async(std::launch::async, fetchReviews);
    // All three are PENDING and running concurrently right now.

    // ...other work here... then collect. get() blocks, so call it LAST.
    std::cout << price.get() << " / " << stock.get() << "\\n";   // ~300 ms total

    // get() re-throws whatever the task threw — errors travel with the future.
    try {
        std::cout << reviews.get() << "\\n";
    } catch (const std::exception& e) {
        std::cout << "caught: " << e.what() << "\\n";            // the .catch()
    }
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::steady_clock::now() - t0).count();
    std::cout << "total: " << ms << " ms\\n";

    // Bounded wait — never block forever on I/O.
    std::future<std::string> slow = std::async(std::launch::async, fetchPrice);
    if (slow.wait_for(100ms) == std::future_status::ready) std::cout << slow.get() << "\\n";
    else std::cout << "still pending after 100 ms\\n";

    // The explicit two ends: promise = write side, future = read side.
    std::promise<int> p;
    std::future<int> f = p.get_future();      // consumer holds this
    std::thread producer([&p] { p.set_value(7); });   // producer completes it once
    std::cout << "promised: " << f.get() << "\\n";
    producer.join();
    slow.wait();
}`,
      },
      {
        label: "Go",
        language: "go",
        filename: "price_service.go",
        code: `package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

type result struct {
	value string
	err   error
}

// In Go the "future" is a channel: the goroutine writes once, the caller reads once.
func fetchAsync(name string, fail bool) <-chan result {
	ch := make(chan result, 1) // buffered so the goroutine never leaks
	go func() {
		time.Sleep(300 * time.Millisecond)
		if fail {
			ch <- result{err: errors.New(name + ": timeout")}
			return
		}
		ch <- result{value: name + " ok"}
	}()
	return ch // the RECEIPT — returned immediately, value lands later
}

func main() {
	// ✅ Fire all three first; the channels are already in flight.
	start := time.Now()
	price := fetchAsync("price", false)
	stock := fetchAsync("stock", false)
	reviews := fetchAsync("reviews", true) // this one fails

	// ...other work here... then receive. Receiving is the get().
	fmt.Println((<-price).value, (<-stock).value)

	// Errors are values in Go — you cannot silently drop them.
	if r := <-reviews; r.err != nil {
		fmt.Println("caught:", r.err) // the .catch()
	}
	fmt.Println("total:", time.Since(start).Round(10*time.Millisecond)) // ~300 ms

	// WaitGroup is the allOf / Promise.all of Go.
	var wg sync.WaitGroup
	for _, name := range []string{"a", "b", "c"} {
		wg.Add(1)
		go func(n string) {
			defer wg.Done()
			time.Sleep(300 * time.Millisecond)
		}(name)
	}
	wg.Wait() // still ~300 ms, not 900

	// Timeout + cancellation ride on context, not on the future itself.
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()
	select {
	case r := <-fetchAsync("slow", false):
		fmt.Println(r.value)
	case <-ctx.Done():
		fmt.Println("gave up:", ctx.Err()) // never wait forever
	}
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for Futures / async when..." },
      {
        type: "ul",
        items: [
          "**The work is I/O-bound** — network calls, database queries, file reads, other services. The thread is waiting, not computing, and waiting is exactly what you can overlap for free.",
          "**You have several independent slow calls** — a page that needs price *and* stock *and* reviews. Fire them all, then combine with `allOf` / `Promise.all` / `gather`. Total time becomes the slowest call, not the sum.",
          "**You need to stay responsive** — a UI that must not freeze, or a server that must keep accepting connections while requests are in flight.",
          "**Concurrency is high but each unit is cheap** — thousands of open sockets. One event loop holds them all; thousands of blocked threads would not fit.",
        ],
      },
      { type: "h", text: "Skip it when..." },
      {
        type: "ul",
        items: [
          "**The work is CPU-bound** — hashing, image resizing, big matrix maths. Async doesn't make the CPU faster; you need real threads or processes for that.",
          "**The calls genuinely depend on each other** — if B needs A's result, chaining buys you nothing over straight-line code except complexity. Only *independent* work overlaps.",
          "**There's just one quick call and nothing else to do** — a plain synchronous call is simpler, easier to debug, and has a readable stack trace.",
          "**Your runtime already gives you cheap blocking** — with Java 21 virtual threads or Go goroutines you can often write plain blocking code and let the runtime park it, keeping the readability without the callback machinery.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Overlapped waiting — several independent slow calls finish in the time of the slowest one instead of the sum.",
        "Threads stay free — no thread is parked doing nothing, so one thread can juggle thousands of pending I/O operations.",
        "Composable — chain with thenApply/then/await for dependent steps, combine with allOf/Promise.all/gather for independent ones.",
        "Explicit failure and timeouts — a settled Future carries its error, and every API offers a bounded wait plus cancellation.",
      ],
      cons: [
        "Easy to write fake-async code — submit followed immediately by get() is serial execution with extra ceremony and no speedup.",
        "Errors vanish silently — a Future nobody awaits or catches can swallow an exception entirely, with no stack trace to find it by.",
        "Harder debugging — stack traces break at every async hop, so 'who called this?' is no longer answerable by reading the stack.",
        "Contagious style — async functions tend to force their callers to be async too, splitting a codebase into blocking and non-blocking halves.",
      ],
    },

    furtherReading: [
      {
        label: "CompletableFuture — Java SE API documentation",
        href: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html",
        note: "The authoritative reference for thenApply, thenCompose, allOf, exceptionally and completion semantics — including which thread each callback runs on.",
        kind: "docs",
      },
      {
        label: "Guide to CompletableFuture — Baeldung",
        href: "https://www.baeldung.com/java-completablefuture",
        note: "The friendliest practical walkthrough: building, chaining, combining and error-handling futures, with runnable examples for each method.",
        kind: "article",
      },
      {
        label: "Using promises — MDN",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises",
        note: "The clearest explanation of chaining, error propagation and why nesting callbacks turns into callback hell — plus how async/await flattens it.",
        kind: "docs",
      },
      {
        label: "asyncio — Coroutines and Tasks (Python docs)",
        href: "https://docs.python.org/3/library/asyncio-task.html",
        note: "Official reference for async/await, create_task, gather, wait_for and cancellation — the single-threaded event-loop model spelled out.",
        kind: "docs",
      },
      {
        label: "std::future — cppreference",
        href: "https://en.cppreference.com/w/cpp/thread/future",
        note: "Precise semantics of the C++ read side: get() moves the value out, re-throws stored exceptions, and wait_for gives you the bounded wait.",
        kind: "docs",
      },
      {
        label: "JEP 444: Virtual Threads",
        href: "https://openjdk.org/jeps/444",
        note: "Java's answer to async's complexity: keep writing plain blocking code, but park a cheap virtual thread instead of an OS thread. Explains why blocking got expensive in the first place.",
        kind: "spec",
      },
      {
        label: "What Color is Your Function? — Bob Nystrom",
        href: "https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/",
        note: "The famous essay on why async/await is contagious across a codebase, and how goroutines and virtual threads sidestep the problem entirely.",
        kind: "article",
      },
    ],

    quiz: [
      {
        id: "futures-promises-async-q1",
        question: "What does a call like executor.submit(task) hand back to you immediately?",
        options: [
          { id: "a", label: "A Future — a placeholder object for a value that will exist later, currently PENDING." },
          { id: "b", label: "The finished result value, once the task has run to completion." },
          { id: "c", label: "A new operating-system thread that you must start yourself." },
          { id: "d", label: "Nothing — the call returns void and you poll a global variable for the result." },
        ],
        correctOptionId: "a",
        explanation:
          "You get a receipt, not a result: a Future that is PENDING right now and will later settle to COMPLETED or FAILED. It is not the value (that would defeat the point — the call would have to block first), and it is not a thread; the executor owns the threads. Polling a global is exactly the mess Futures replace.",
      },
      {
        id: "futures-promises-async-q2",
        question: "A colleague writes: for (id : ids) { var f = pool.submit(() -> fetch(id)); results.add(f.get()); }. Three fetches take 300 ms each. How long does the loop take, and why?",
        options: [
          { id: "a", label: "About 900 ms — get() blocks right after each submit, so nothing overlaps; it's serial code with extra steps." },
          { id: "b", label: "About 300 ms — using a thread pool automatically makes the calls run in parallel." },
          { id: "c", label: "About 100 ms — the pool splits each 300 ms call across three threads." },
          { id: "d", label: "It fails to compile, because get() can't be called inside a loop." },
        ],
        correctOptionId: "a",
        explanation:
          "The Future is created and then immediately waited on in the same iteration, so call two doesn't start until call one has finished — 3 × 300 ms. Using a pool does not create overlap by itself (b); you have to submit everything first and collect afterwards. A single call can't be split across threads (c), and the code compiles fine (d) — it's just pointlessly slow.",
      },
      {
        id: "futures-promises-async-q3",
        question: "Classically, what is the difference between a Future and a Promise?",
        options: [
          { id: "a", label: "The Future is the read side that the caller waits on; the Promise is the write side that the producer completes." },
          { id: "b", label: "A Future can fail but a Promise can only ever succeed." },
          { id: "c", label: "A Future is single-threaded and a Promise is multi-threaded." },
          { id: "d", label: "A Future is used for I/O and a Promise is used for CPU work." },
        ],
        correctOptionId: "a",
        explanation:
          "They are the two ends of one box: the producer holds the Promise and calls complete/set_value exactly once, while the consumer holds the Future and reads or attaches callbacks. C++ splits them explicitly (std::promise / std::future); Java's CompletableFuture merges both roles. Both ends can carry a failure, and neither implies a threading model or a workload type.",
      },
      {
        id: "futures-promises-async-q4",
        question: "An async task throws, and nothing in the chain calls .catch() / exceptionally() / awaits the Future. What happens?",
        options: [
          { id: "a", label: "The error is stored in the settled Future and can disappear silently — no stack trace, just a result that never arrives." },
          { id: "b", label: "The error is automatically rethrown on the main thread at the point where the task was submitted." },
          { id: "c", label: "The runtime retries the task until it succeeds." },
          { id: "d", label: "The Future rolls back to PENDING so the work can be resubmitted." },
        ],
        correctOptionId: "a",
        explanation:
          "A failed Future settles into the FAILED state holding the error, and the error only surfaces when someone reads or handles it. The submitting code returned long ago, so nothing can be rethrown there (b). Nothing retries automatically (c), and settling is a one-way door — a Future never returns to PENDING (d). Always terminate a chain with an error handler.",
      },
      {
        id: "futures-promises-async-q5",
        question: "Which statement about async I/O is correct?",
        options: [
          { id: "a", label: "Async is about not blocking a thread while waiting — one thread can hold thousands of pending I/O operations." },
          { id: "b", label: "Async always means one extra thread is created per pending operation." },
          { id: "c", label: "Async makes CPU-bound work such as image resizing finish faster." },
          { id: "d", label: "Async removes the need for timeouts, because pending work never gets stuck." },
        ],
        correctOptionId: "a",
        explanation:
          "Async buys concurrency, not parallelism: instead of parking a thread (and its whole stack) on every wait, the runtime records 'resume here when this socket is ready', which is why an event loop on one thread scales to thousands of connections. It does not spawn a thread per operation (b), does nothing for CPU-bound work (c), and makes bounded waits more important, not less (d).",
      },
      {
        id: "futures-promises-async-q6",
        question: "You need call B's result to make call C, but call A is independent of both. What's the right composition?",
        options: [
          { id: "a", label: "Start A and B together, chain C onto B with thenCompose/await, then combine A and C with allOf / Promise.all." },
          { id: "b", label: "Chain all three in one sequence so the order is easy to read." },
          { id: "c", label: "Put all three in allOf — combining always overlaps everything, even dependent calls." },
          { id: "d", label: "Call get() on each one right after starting it, so nothing gets out of order." },
        ],
        correctOptionId: "a",
        explanation:
          "Independent work overlaps and dependent work sequences: A and B start at once, C is chained after B because it needs B's value, and the fan-in waits for whatever is still outstanding. Chaining everything (b) serialises A for no reason, allOf cannot magically overlap a genuine dependency (c), and calling get() after each start (d) is the classic mistake that throws away all the overlap.",
      },
    ],
  },
};
