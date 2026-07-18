import type { RoadmapLesson } from "@/lib/content/types";

export const pubSubEventDriven: RoadmapLesson = {
  title: "Pub/Sub & Event-driven",
  oneLiner:
    "Fully decouple who sends from who receives. A *publisher* shouts a message onto a named **topic** (\"orders\") and has no idea who — if anyone — is listening. A **broker** in the middle keeps the topic lists and hands a copy to every *subscriber* that signed up for it. Nobody has anybody's phone number: add a brand-new listener and the publisher's code never changes by a single line.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/pub-sub-event-driven.html",
  content: {
    prototypeCaption:
      "A 📮 **Broker / Event Bus** in the middle holding two topics — 🟢 *orders* and 🔵 *payments* — with three services on the right that each choose which topics to subscribe to. Flip the *orders* chip on **EmailService** and **InventoryService**, then hit **▶ Publish to orders**: a message dot flies from the publisher *into the broker* and fans out to **only** the orders subscribers — their 📥 inbox ticks, everyone else stays dim. Notice the publisher's dot always stops **at the broker**: it has no wire to the services and never learns who received it. Add or drop a subscriber with a chip and publish again — a *different* set gets the message, and the banner still reads **publisher code changed: 0 lines**.",

    overview: [
      {
        type: "p",
        text: "**Pub/Sub** (publish–subscribe) takes decoupling to its limit. Its intent in one sentence: **route messages through a broker keyed by topic, so producers and consumers never know each other exists.** A *publisher* emits a message to a named **topic** — it doesn't call anyone, doesn't hold a list, doesn't know if a single soul is listening. A *subscriber* registers with the broker for the topics it cares about. The **broker** in the middle keeps the topic-to-subscriber lists and delivers a copy of each message to everyone who signed up. The two sides are *mutually anonymous*.",
      },
      {
        type: "p",
        text: "The mental model is a **radio station plus a topic-based mailing list**. The station broadcasts on a frequency (\"orders\"); it has no idea how many radios are tuned in, or whose. Anyone who tuned to that frequency hears it; anyone who didn't, hears nothing. The station never phones a listener, and a listener never phones the station — the airwaves (the **broker**) sit between them. Want to start listening? Tune in. Want to stop? Tune out. The broadcaster's routine doesn't change either way.",
      },
      {
        type: "p",
        text: "*Event-driven architecture* is this idea scaled up to whole systems: instead of services calling each other directly, each one reacts to a **stream of events** flowing through a broker. \"Order placed\" is published once; the email service, the inventory service, and the analytics service each react on their own. Add a fraud-check service next year and you subscribe it to the same event — nobody who already publishes \"order placed\" has to be touched.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "Observer's subject holds the list and calls its observers itself; **pub/sub inserts a broker** so publishers emit to a *topic* and subscribers register with the *broker* — the two sides never reference each other, and delivery can be async or across a network.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You've already used it today",
        text: "The browser's `EventTarget` / DOM `CustomEvent` bus, Node's `EventEmitter`, Redis `PUBLISH`/`SUBSCRIBE`, Kafka and RabbitMQ topics, and cloud services like AWS SNS/SQS or Google Cloud Pub/Sub are all this pattern — publishers dropping messages onto named channels for anonymous subscribers to pick up.",
      },
    ],

    howItWorks: [
      { type: "h", text: "The three roles" },
      {
        type: "p",
        text: "Where Observer has two participants, pub/sub has three — and the new one, the broker, is the whole point:",
      },
      {
        type: "ul",
        items: [
          "**Publisher** — produces a message and hands it to the broker on a named topic: `publish(\"orders\", msg)`. That's it. It never holds a subscriber list, never loops over anyone, and gets no answer back about who received it.",
          "**Broker (the event bus)** — the middleman. It owns the topic-to-subscriber lists and exposes two doors: `subscribe(topic, handler)` adds a handler to a topic's list, and `publish(topic, msg)` looks up that topic's list and delivers a copy to every handler on it. Publishers and subscribers only ever talk to *this*.",
          "**Subscriber** — registers a handler with the broker for the topics it cares about, then reacts whenever a message arrives. It never knows who published, or whether other subscribers exist.",
        ],
      },
      {
        type: "code",
        language: "typescript",
        code: `type Handler = (payload: unknown) => void;

class EventBus {                                  // the BROKER
  private topics: Record<string, Handler[]> = {}; // topic -> subscriber list

  subscribe(topic: string, handler: Handler) {    // a subscriber signs up
    (this.topics[topic] ||= []).push(handler);
  }

  publish(topic: string, payload: unknown) {      // a publisher emits
    for (const h of this.topics[topic] || []) {   // route to THIS topic only
      h(payload);                                  // deliver a copy to each
    }
  }
}`,
      },
      {
        type: "p",
        text: "Read the two methods carefully: `publish` never mentions a subscriber, and `subscribe` never mentions a publisher. They only share a *string* — the topic name. That string is the entire contract between the two sides.",
      },
      { type: "h", text: "Topic routing — the message only goes where it's addressed" },
      {
        type: "p",
        text: "A message published to `\"orders\"` reaches *only* the handlers that subscribed to `\"orders\"`. A subscriber tuned to `\"payments\"` hears nothing. This is what makes one broker able to carry many independent conversations at once without them bleeding into each other — the topic is the channel.",
      },
      {
        type: "figure",
        caption: "Publishers emit to topics on the broker; the broker fans each message out only to that topic's subscribers. The two sides share nothing but a topic name.",
        svg: `<svg viewBox="0 0 640 300" width="100%" style="max-width:640px;display:block;margin:0 auto;font-family:ui-monospace,monospace" role="img" aria-label="Publishers emit to a broker with topics orders and payments; the broker routes each message only to subscribers of that topic">
  <text x="60" y="24" fill="#9099a8" font-size="11">PUBLISHERS</text>
  <rect x="16" y="70" width="120" height="42" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="76" y="96" fill="#e8e4dc" font-size="12" text-anchor="middle">Order API</text>
  <rect x="16" y="150" width="120" height="42" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="76" y="176" fill="#e8e4dc" font-size="12" text-anchor="middle">Payment API</text>

  <text x="290" y="24" fill="#fb863a" font-size="11">BROKER</text>
  <rect x="250" y="40" width="150" height="200" rx="8" fill="#14161a" stroke="#fb863a"/>
  <text x="325" y="64" fill="#9099a8" font-size="10" text-anchor="middle">Event Bus</text>
  <rect x="268" y="82" width="114" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="325" y="104" fill="#e8e4dc" font-size="11" text-anchor="middle">topic: orders</text>
  <rect x="268" y="150" width="114" height="34" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="325" y="172" fill="#e8e4dc" font-size="11" text-anchor="middle">topic: payments</text>

  <text x="520" y="24" fill="#9099a8" font-size="11">SUBSCRIBERS</text>
  <rect x="500" y="60" width="124" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="562" y="82" fill="#e8e4dc" font-size="11" text-anchor="middle">EmailService</text>
  <rect x="500" y="128" width="124" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="562" y="150" fill="#e8e4dc" font-size="11" text-anchor="middle">Inventory</text>
  <rect x="500" y="196" width="124" height="34" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="562" y="218" fill="#e8e4dc" font-size="11" text-anchor="middle">Analytics</text>

  <line x1="136" y1="91" x2="268" y2="99" stroke="#2d333d" stroke-width="1.5"/>
  <line x1="136" y1="171" x2="268" y2="167" stroke="#2d333d" stroke-width="1.5"/>
  <line x1="382" y1="99" x2="500" y2="77" stroke="#fb863a" stroke-width="1.5"/>
  <line x1="382" y1="99" x2="500" y2="145" stroke="#fb863a" stroke-width="1.5"/>
  <line x1="382" y1="167" x2="500" y2="213" stroke="#fb863a" stroke-width="1.5"/>
  <text x="325" y="272" fill="#9099a8" font-size="10" text-anchor="middle">orders reaches Email + Inventory · payments reaches Analytics</text>
</svg>`,
      },
      { type: "h", text: "The decoupling payoff" },
      {
        type: "p",
        text: "Because the two sides only share a topic name, you can add, remove, or replace subscribers freely — while the system runs, and even in *other processes or machines* — without the publisher noticing. This is the headline benefit:",
      },
      {
        type: "ul",
        items: [
          "**Add a consumer with zero producer changes** — a new analytics service subscribes to `\"orders\"`; the order publisher's code is untouched.",
          "**Cross a boundary** — the broker can be an in-memory object, or a network service (Redis, Kafka, SNS). Publisher and subscriber can live in different processes, languages, or data centres.",
          "**Fan out for free** — one `publish` naturally reaches many subscribers; going from one consumer to five is a subscription change, not a rewrite.",
        ],
      },
      { type: "h", text: "Observer vs pub/sub — close cousins, not twins" },
      {
        type: "p",
        text: "In [[observer]], the subject **holds its observer list itself** and calls each observer's `update()` **synchronously, in the same process** — the two sides are coupled at least through that interface, and the observer knows which subject it joined. Pub/sub adds a **broker** in the middle: publishers emit to a *topic*, subscribers register with the *broker*, and neither side references the other at all — not even by interface. That extra hop is what lets delivery become **asynchronous** or travel over a **network**. If your middleman starts making *decisions* about who should talk to whom (not just fanning out by topic), you're drifting toward a [[mediator]].",
      },
      {
        type: "callout",
        variant: "info",
        title: "Same word, two scopes",
        text: "\"Pub/sub\" describes both a tiny in-process **event bus** (Node `EventEmitter`, a DOM `CustomEvent` bus) and a heavyweight **message broker** across a network (Kafka, RabbitMQ, SNS/SQS). Same shape — publisher, topic, broker, subscriber — very different delivery guarantees.",
      },
      { type: "h", text: "The trade-offs of going event-driven" },
      {
        type: "p",
        text: "The anonymity that buys you decoupling also takes something away: you can no longer read the flow straight off the code.",
      },
      {
        type: "ul",
        items: [
          "**\"Who handled this?\"** — a publisher just drops a message and moves on. Following what actually happens next means knowing every subscriber, which isn't visible at the publish site. Debugging shifts from reading a call stack to tracing events.",
          "**Eventual consistency** — subscribers react on their own schedule, so the system is briefly out of sync after each event. You give up the instant, all-in-one-transaction feel of a direct call.",
          "**Delivery guarantees** — a networked broker chooses between *at-least-once* (may deliver duplicates — handlers must be idempotent) and *at-most-once* (may drop). Exactly-once is famously hard.",
          "**Ordering** — messages can arrive out of order, especially across partitions or retries; if order matters you must design for it explicitly.",
          "**The invisible web** — it's easy to grow an untraceable tangle where event A fires B fires C, and no one can say what a single publish will ultimately trigger.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Fire-and-forget means no answer",
        text: "Publishing is one-way: you do not get a return value telling you who received the message or what they did with it. If you need a synchronous result back, pub/sub is the wrong tool — make a direct call instead.",
      },
    ],

    handsOn: [
      {
        title: "01 · Subscribe some services to a topic",
        body: "On the right, click the 🟢 orders chip on EmailService and InventoryService — each chip lights up as one subscribe(\"orders\", handler) call landing in the broker's orders list. The broker's orders topic now shows 2 subscribers. Nothing has been delivered yet: subscribing only registers interest.",
      },
      {
        title: "02 · Publish and watch topic routing",
        body: "Hit ▶ Publish to orders. A message dot flies from the publisher into the broker's orders topic, then fans out to only EmailService and InventoryService — their 📥 inbox badges tick +1 while AnalyticsService stays dim, skipped. Crucially the publisher's dot stops at the broker: it never touches a service and never learns who received it. Now hit ▶ Publish to payments — with no payments subscribers, the message reaches the broker and goes nowhere.",
      },
      {
        title: "03 · Add a subscriber at runtime — zero publisher changes",
        body: "Flip the 🔵 payments chip on AnalyticsService, then publish to payments again. This time the message routes to Analytics, and the banner reads 'publisher code changed: 0 lines' — you changed who listens without touching the publisher. Toggle chips on and off and re-publish to see a different set light up each time. Hit ↺ Reset to start clean.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "event-bus.ts",
        code: `type Handler = (payload: unknown) => void;

// The BROKER — the only thing publishers and subscribers ever touch.
class EventBus {
  private topics: Record<string, Handler[]> = {};   // topic -> subscriber list

  subscribe(topic: string, handler: Handler): void {
    (this.topics[topic] ||= []).push(handler);       // sign up for a topic
  }

  publish(topic: string, payload: unknown): void {
    for (const h of this.topics[topic] || []) {      // route to THIS topic only
      h(payload);                                     // deliver a copy to each
    }
  }
}

const bus = new EventBus();

// Two subscribers on ONE topic — they don't know each other or the publisher.
bus.subscribe("orders", (o) => console.log("📧 email:", o));
bus.subscribe("orders", (o) => console.log("📦 stock:", o));

// A publisher that knows nobody — just a topic name and a payload.
bus.publish("orders", { id: 42 });   // → both handlers run
bus.publish("payments", { id: 42 }); // → nobody subscribed, goes nowhere`,
      },
      {
        label: "Java",
        language: "java",
        filename: "EventBus.java",
        code: `import java.util.*;
import java.util.function.Consumer;

// The BROKER — the only thing publishers and subscribers ever touch.
class EventBus {
    private final Map<String, List<Consumer<Object>>> topics = new HashMap<>();

    public void subscribe(String topic, Consumer<Object> handler) {
        topics.computeIfAbsent(topic, t -> new ArrayList<>()).add(handler);
    }

    public void publish(String topic, Object payload) {
        for (Consumer<Object> h : topics.getOrDefault(topic, List.of())) {
            h.accept(payload);                 // deliver a copy to each subscriber
        }
    }
}

class Demo {
    public static void main(String[] args) {
        EventBus bus = new EventBus();

        // Two subscribers on ONE topic — mutually anonymous.
        bus.subscribe("orders", o -> System.out.println("📧 email: " + o));
        bus.subscribe("orders", o -> System.out.println("📦 stock: " + o));

        // A publisher that knows nobody — just a topic + payload.
        bus.publish("orders", "#42");    // → both handlers run
        bus.publish("payments", "#42");  // → nobody subscribed, goes nowhere
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "event_bus.py",
        code: `from collections import defaultdict
from typing import Callable


class EventBus:                       # the BROKER
    def __init__(self) -> None:
        self._topics: dict[str, list[Callable]] = defaultdict(list)

    def subscribe(self, topic: str, handler: Callable) -> None:
        self._topics[topic].append(handler)      # sign up for a topic

    def publish(self, topic: str, payload) -> None:
        for handler in self._topics.get(topic, []):   # this topic only
            handler(payload)                          # deliver to each


bus = EventBus()

# Two subscribers on ONE topic — they don't know each other or the publisher.
bus.subscribe("orders", lambda o: print("📧 email:", o))
bus.subscribe("orders", lambda o: print("📦 stock:", o))

# A publisher that knows nobody — just a topic name and a payload.
bus.publish("orders", {"id": 42})     # → both handlers run
bus.publish("payments", {"id": 42})   # → nobody subscribed, goes nowhere`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "event_bus.cpp",
        code: `#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

// The BROKER — the only thing publishers and subscribers ever touch.
class EventBus {
    std::map<std::string, std::vector<std::function<void(const std::string&)>>> topics;

public:
    void subscribe(const std::string& topic,
                   std::function<void(const std::string&)> handler) {
        topics[topic].push_back(std::move(handler));    // sign up for a topic
    }

    void publish(const std::string& topic, const std::string& payload) {
        for (auto& h : topics[topic]) {                 // route to this topic only
            h(payload);                                 // deliver a copy to each
        }
    }
};

int main() {
    EventBus bus;

    // Two subscribers on ONE topic — mutually anonymous.
    bus.subscribe("orders", [](const std::string& o){ std::cout << "📧 email: " << o << "\\n"; });
    bus.subscribe("orders", [](const std::string& o){ std::cout << "📦 stock: " << o << "\\n"; });

    // A publisher that knows nobody — just a topic + payload.
    bus.publish("orders", "#42");    // → both handlers run
    bus.publish("payments", "#42");  // → nobody subscribed, goes nowhere
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Reach for pub/sub when..." },
      {
        type: "ul",
        items: [
          "**Many consumers must react to the same event, and the set keeps changing** — one \"order placed\" needs to reach email, inventory, and analytics today, and fraud-check tomorrow, without editing the producer.",
          "**Producers and consumers should be independently deployable** — decoupling through a broker lets teams ship, scale, and restart their services on their own schedule.",
          "**Work can happen asynchronously** — the publisher doesn't need to wait for or hear back from the consumers; fire-and-forget is fine, or even desirable for smoothing load spikes.",
          "**You're building an event-driven system across process or network boundaries** — where a shared broker (Kafka, RabbitMQ, SNS/SQS) is the natural backbone.",
        ],
      },
      { type: "h", text: "Skip it when..." },
      {
        type: "ul",
        items: [
          "**A simple direct call is clearer** — if A always calls B and only B, a broker and a topic name are indirection with no payoff. Just call the function.",
          "**You need a guaranteed synchronous result back** — pub/sub is fire-and-forget; it returns nothing about who received the message. Use a direct call or request/response instead.",
          "**Strict ordering, tracing, or transactions matter more than decoupling** — when you must reason precisely about the sequence of effects or roll them back atomically, the event web's opacity works against you.",
        ],
      },
    ],

    tradeoffs: {
      pros: [
        "Maximum decoupling — publishers and subscribers are mutually anonymous, sharing nothing but a topic name, so either side can change or be redeployed independently.",
        "Add consumers with zero producer changes — a new subscriber on an existing topic requires not a single line changed in any publisher.",
        "Natural fan-out and scale — one publish reaches many subscribers, and the broker can absorb bursts and buffer work across processes and machines.",
        "Crosses boundaries — the same shape works in-process or over a network, letting components live in different processes, languages, or data centres.",
      ],
      cons: [
        "Hard to trace flow — 'who handled this?' isn't answerable from the publish site; debugging means following events, not a call stack.",
        "Eventual consistency — subscribers react on their own schedule, so the system is briefly inconsistent after each event and you lose transactional all-or-nothing semantics.",
        "Delivery and ordering caveats — networked brokers force a choice between at-least-once (duplicates) and at-most-once (drops), and messages can arrive out of order.",
        "The invisible web — unchecked, events can chain into an untraceable tangle where no one can predict what a single publish ultimately triggers.",
      ],
    },

    furtherReading: [
      {
        label: "What do you mean by \"Event-Driven\"? — Martin Fowler",
        href: "https://martinfowler.com/articles/201701-event-driven.html",
        note: "Untangles the four different things people mean by 'event-driven' (event notification, event-carried state transfer, event sourcing, CQRS). Essential for not conflating them.",
        kind: "article",
      },
      {
        label: "Publish-Subscribe Channel — Enterprise Integration Patterns",
        href: "https://www.enterpriseintegrationpatterns.com/patterns/messaging/PublishSubscribeChannel.html",
        note: "The canonical pattern definition: one input channel, a copy delivered to each subscriber. The reference vocabulary for messaging systems.",
        kind: "article",
      },
      {
        label: "What is Pub/Sub? — Google Cloud",
        href: "https://cloud.google.com/pubsub/docs/overview",
        note: "A clear vendor overview of topics, subscriptions, publishers, and subscribers, plus at-least-once delivery and the push/pull subscription models.",
        kind: "docs",
      },
      {
        label: "Amazon SNS — How it works (AWS docs)",
        href: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
        note: "SNS is pub/sub as a managed service: publishers send to a topic, and each subscription (queue, function, endpoint) gets a copy. A concrete cloud implementation.",
        kind: "docs",
      },
      {
        label: "Apache Kafka — Introduction",
        href: "https://kafka.apache.org/intro",
        note: "The dominant event-streaming broker. Explains topics, partitions, producers, and consumers, and how ordering and retention actually work at scale.",
        kind: "docs",
      },
      {
        label: "CustomEvent — MDN",
        href: "https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent",
        note: "Pub/sub in the browser: dispatch a named CustomEvent and any addEventListener handler for that name receives it — an in-page event bus you already have.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "pubsub-q1",
        question: "In pub/sub, what sits between publishers and subscribers?",
        options: [
          { id: "a", label: "A broker (event bus / message queue) that keeps topic lists and delivers each message to that topic's subscribers." },
          { id: "b", label: "Nothing — the publisher holds a list of subscribers and calls each one directly." },
          { id: "c", label: "A single global variable both sides read and write." },
          { id: "d", label: "A database table that subscribers poll on a timer." },
        ],
        correctOptionId: "a",
        explanation:
          "The defining feature of pub/sub is the broker in the middle. Publishers emit to a topic on the broker, subscribers register with the broker, and it routes each message to the right list. Option (b) describes Observer, where the subject holds the list itself.",
      },
      {
        id: "pubsub-q2",
        question: "How does pub/sub differ from the classic Observer pattern?",
        options: [
          { id: "a", label: "Observer's subject holds the list and calls observers directly and synchronously; pub/sub adds a broker so the two sides are fully anonymous and delivery can be async or networked." },
          { id: "b", label: "They are the same pattern with different names." },
          { id: "c", label: "Observer requires a network; pub/sub only works in one process." },
          { id: "d", label: "Pub/sub needs the publisher to import every subscriber class." },
        ],
        correctOptionId: "a",
        explanation:
          "In Observer the subject owns its observer list and invokes update() on each one itself, in-process. Pub/sub inserts a broker: publishers emit to a topic, subscribers register with the broker, and neither references the other — which is what allows asynchronous or cross-network delivery.",
      },
      {
        id: "pubsub-q3",
        question: "What does a publisher know about its subscribers?",
        options: [
          { id: "a", label: "Nothing — it only knows a topic name; it doesn't know how many subscribers exist, who they are, or even if there are any." },
          { id: "b", label: "Their exact concrete classes, so it can call specific methods." },
          { id: "c", label: "The full list, which it iterates over itself when publishing." },
          { id: "d", label: "Only the subscribers registered at compile time." },
        ],
        correctOptionId: "a",
        explanation:
          "Publisher and subscriber are mutually anonymous. The publisher hands a message to the broker on a named topic and moves on; it never holds a list, never loops, and gets no answer about who received it. If it held and iterated the list itself, that would be Observer.",
      },
      {
        id: "pubsub-q4",
        question: "A publisher emits a message on the topic \"orders\". Who receives it?",
        options: [
          { id: "a", label: "Only the subscribers that registered for \"orders\" — subscribers on other topics like \"payments\" hear nothing." },
          { id: "b", label: "Every subscriber connected to the broker, on all topics." },
          { id: "c", label: "Only the first subscriber that registered for \"orders\"." },
          { id: "d", label: "Only subscribers in the same process as the publisher." },
        ],
        correctOptionId: "a",
        explanation:
          "The topic is the address. A message published to \"orders\" is routed only to the \"orders\" subscriber list; a subscriber tuned to \"payments\" gets nothing. Topic routing is what lets one broker carry many independent conversations without them mixing.",
      },
      {
        id: "pubsub-q5",
        question: "You want to add a new AnalyticsService that reacts to every order. What has to change in the order publisher?",
        options: [
          { id: "a", label: "Nothing — AnalyticsService just subscribes to the \"orders\" topic; the publisher's code is untouched." },
          { id: "b", label: "The publisher must import AnalyticsService and add a call to it." },
          { id: "c", label: "The publisher must add AnalyticsService to a list it maintains." },
          { id: "d", label: "The publisher must be redeployed with a new topic name." },
        ],
        correctOptionId: "a",
        explanation:
          "This is the headline payoff of pub/sub. Because producer and consumer only share a topic name, a new subscriber on an existing topic requires zero changes to any publisher — you can even add it in another process while the system runs.",
      },
      {
        id: "pubsub-q6",
        question: "Which is a genuine downside of going event-driven with pub/sub?",
        options: [
          { id: "a", label: "It's harder to trace flow ('who handled this?'), you get eventual consistency, and you must reason about delivery guarantees and ordering." },
          { id: "b", label: "Publishers and subscribers become tightly coupled to each other's classes." },
          { id: "c", label: "You can no longer have more than one subscriber per topic." },
          { id: "d", label: "Adding a new consumer forces you to rewrite every publisher." },
        ],
        correctOptionId: "a",
        explanation:
          "The anonymity that buys decoupling also hides the flow: you can't read what happens next off the publish site, subscribers react on their own schedule (eventual consistency), and a networked broker forces choices about at-least-once vs at-most-once delivery and ordering. Options (b), (c), and (d) are the opposite of what pub/sub does.",
      },
    ],
  },
};
