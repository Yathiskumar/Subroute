import type { RoadmapLesson } from "@/lib/content/types";

export const notificationSystem: RoadmapLesson = {
  title: "Notification system",
  oneLiner:
    "The sender must not know how — or even whether — the message arrives. `OrderService` publishes *“order shipped”* and walks away; something else decides that this user wants SMS and push but not email, renders a different body for each, and then deals with the fact that **delivery fails**. All the interesting code lives after `send()` returns.",
  difficulty: "intermediate",
  estimatedTime: "30 min",
  prototypePath: "/prototypes/lld/notification-system.html",
  content: {
    prototypeCaption:
      "Press **📦 OrderShipped** and watch it fan out: **U-2** has SMS and push on for that event and email off, so **two** notifications leave, not three — and each box shows a body written for *its* channel, with a character count. Click the **📧 cell on the U-2 row** to turn email on and fire the identical event again: a third box lights up with the full paragraph, and the publish call is **byte-for-byte unchanged**. Then turn on **⚠️ Flaky SMS** and watch the retry timeline widen — 1s, 2s, 4s, 8s, each inside a jitter band — before the message lands in the **dead-letter tray**. Now try **💀 Invalid number**: that one goes straight to the DLQ with **no retries at all**. Finish with **♻️ Duplicate publish** (stopped at the dedup key), **🔥 Burst 12** with **🎲 Jitter** off, and **⚡ Promo blast + OTP**.",

    // ------------------------------------------------------------------
    overview: [
      {
        type: "p",
        text: "*“Design a notification system.”* Most candidates hear *“send an email”* and start writing an `EmailSender`. That is the wrong end of the problem. Sending is the easy part — a library call. The round is about everything around it.",
      },
      {
        type: "p",
        text: "Picture what actually happens. An order ships. Somewhere in the warehouse service a line of code runs, and a few seconds later a customer's phone buzzes. Between those two moments, three questions were answered: **does this person want to hear about this at all**, **on which channel**, and **what happens if the phone network drops the message**. The warehouse service knows none of that and must never learn it.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 330" width="100%" style="max-width:740px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The whole notification pipeline. On the left, three event sources - OrderService, AuthService and MarketingJob - publish events into a NotificationService. The service reads a UserPreference store and a Template store, then enqueues notifications into a priority queue. A worker pool drains the queue and calls one of four channels: EmailChannel, SmsChannel, PushChannel and WhatsAppChannel, each delivering to a device. Failed sends loop back into the queue for retry, and exhausted ones fall into a dead letter queue.">
  <defs>
    <marker id="ns-flow" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="ns-thin" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#5e9ff6"/></marker>
    <marker id="ns-back" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <text x="12" y="26" font-size="9" fill="#6b7280">«event source»</text>
  <rect x="12" y="34" width="120" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="24" y="53" font-size="9.5" fill="#e8e4dc">OrderService</text>
  <rect x="12" y="72" width="120" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="24" y="91" font-size="9.5" fill="#e8e4dc">AuthService</text>
  <rect x="12" y="110" width="120" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="24" y="129" font-size="9.5" fill="#e8e4dc">MarketingJob</text>
  <text x="12" y="164" font-size="9" fill="#5cc66f">they publish events —</text>
  <text x="12" y="178" font-size="9" fill="#5cc66f">no address, no channel,</text>
  <text x="12" y="192" font-size="9" fill="#5cc66f">no subject line</text>

  <line x1="132" y1="49" x2="172" y2="76" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-flow)"/>
  <line x1="132" y1="87" x2="172" y2="87" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-flow)"/>
  <line x1="132" y1="125" x2="172" y2="98" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-flow)"/>

  <rect x="176" y="46" width="152" height="80" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="188" y="66" font-size="10.5" fill="#fb863a">NotificationService</text>
  <line x1="176" y1="74" x2="328" y2="74" stroke="#2d333d"/>
  <text x="188" y="92" font-size="9" fill="#e8e4dc">+ publish(event)</text>
  <text x="188" y="108" font-size="9" fill="#9099a8">resolve → render</text>
  <text x="188" y="122" font-size="9" fill="#9099a8">→ dedup → enqueue</text>

  <rect x="168" y="164" width="78" height="52" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="176" y="182" font-size="9" fill="#5e9ff6">UserPreference</text>
  <text x="176" y="198" font-size="8.5" fill="#9099a8">who + whether</text>
  <text x="176" y="211" font-size="8.5" fill="#9099a8">+ quiet hours</text>
  <rect x="254" y="164" width="78" height="52" rx="5" fill="#14161a" stroke="#5e9ff6"/>
  <text x="262" y="182" font-size="9" fill="#5e9ff6">Template</text>
  <text x="262" y="198" font-size="8.5" fill="#9099a8">what to say,</text>
  <text x="262" y="211" font-size="8.5" fill="#9099a8">per channel</text>
  <line x1="207" y1="164" x2="207" y2="130" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#ns-thin)"/>
  <line x1="293" y1="164" x2="293" y2="130" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3" marker-end="url(#ns-thin)"/>
  <text x="168" y="234" font-size="9" fill="#6b7280">both are rows, not code</text>

  <line x1="328" y1="86" x2="360" y2="86" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-flow)"/>

  <rect x="364" y="46" width="104" height="80" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="374" y="64" font-size="10" fill="#e8e4dc">Queue</text>
  <rect x="374" y="74" width="84" height="14" rx="3" fill="rgba(240,104,104,0.14)" stroke="rgba(240,104,104,0.4)"/><text x="380" y="85" font-size="7.5" fill="#f06868">OTP · high</text>
  <rect x="374" y="92" width="84" height="14" rx="3" fill="#1a1d22" stroke="#2d333d"/><text x="380" y="103" font-size="7.5" fill="#9099a8">shipped · normal</text>
  <rect x="374" y="110" width="84" height="14" rx="3" fill="#1a1d22" stroke="#2d333d"/><text x="380" y="121" font-size="7.5" fill="#6b7280">promo · low</text>

  <rect x="364" y="164" width="104" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="374" y="184" font-size="10" fill="#e8e4dc">Worker pool</text>
  <text x="374" y="200" font-size="8.5" fill="#9099a8">drains the queue</text>
  <text x="374" y="212" font-size="8.5" fill="#6b7280">off the request path</text>
  <line x1="416" y1="126" x2="416" y2="160" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-flow)"/>

  <rect x="512" y="20" width="126" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="522" y="41" font-size="9" fill="#e8e4dc">EmailChannel</text>
  <rect x="512" y="62" width="126" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="522" y="83" font-size="9" fill="#e8e4dc">SmsChannel</text>
  <rect x="512" y="104" width="126" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="522" y="125" font-size="9" fill="#e8e4dc">PushChannel</text>
  <rect x="512" y="146" width="126" height="34" rx="5" fill="#14161a" stroke="#2d333d"/><text x="522" y="167" font-size="9" fill="#e8e4dc">WhatsAppChannel</text>
  <text x="512" y="196" font-size="9" fill="#fb863a">one interface, four impls</text>

  <line x1="468" y1="182" x2="504" y2="40" stroke="#fb863a" stroke-width="1" opacity=".5" marker-end="url(#ns-flow)"/>
  <line x1="468" y1="182" x2="504" y2="82" stroke="#fb863a" stroke-width="1" marker-end="url(#ns-flow)"/>
  <line x1="468" y1="182" x2="504" y2="124" stroke="#fb863a" stroke-width="1" marker-end="url(#ns-flow)"/>
  <line x1="468" y1="182" x2="504" y2="166" stroke="#fb863a" stroke-width="1" opacity=".5" marker-end="url(#ns-flow)"/>

  <text x="664" y="44" font-size="20">📧</text>
  <text x="664" y="86" font-size="20">💬</text>
  <text x="664" y="128" font-size="20">🔔</text>
  <text x="664" y="170" font-size="20">💚</text>

  <path d="M638,79 L700,79 L700,244 L430,244" fill="none" stroke="#f06868" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#ns-back)"/>
  <text x="470" y="238" font-size="9" fill="#f06868">RETRYABLE → back to the queue with backoff</text>

  <rect x="512" y="262" width="188" height="42" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <text x="524" y="280" font-size="10" fill="#f06868">DeadLetterQueue</text>
  <text x="524" y="296" font-size="8.5" fill="#9099a8">permanent, or attempts exhausted</text>
  <line x1="576" y1="182" x2="576" y2="258" stroke="#f06868" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#ns-back)"/>

  <text x="12" y="280" font-size="9.5" fill="#9099a8">Every noun on this picture is a class.</text>
  <text x="12" y="296" font-size="9.5" fill="#9099a8">Draw it in minute 6 and the rest of</text>
  <text x="12" y="312" font-size="9.5" fill="#9099a8">the hour writes itself.</text>
</svg>`,
        caption:
          "Follow one event left to right, then follow the **red dashed lines back**. Those two returns — retry into the queue, or fall into the dead-letter queue — are where this problem actually lives.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The whole system in three sentences",
        text: "A publisher emits an **event** that names *what happened*, never *how to tell anyone*. The `NotificationService` asks the **preferences** which channels this user wants for this event, and the **templates** what the body should say on each of those channels. Then it **enqueues** — and a worker deals with the fact that sending is unreliable: retry with backoff and jitter if the failure looks temporary, dead-letter it if it does not.",
      },
      { type: "h", text: "What is actually being graded" },
      {
        type: "ol",
        items: [
          "**Does the publisher stay ignorant?** If `OrderService` ever touches an email address, a phone number or the string `\"SMS\"`, you have already lost the main point.",
          "**Is `DeliveryResult` more than a boolean?** Success, **retryable** failure and **permanent** failure are three different things, and treating the last two the same is a production incident.",
          "**Is the retry bounded, backed off, and jittered?** *“I'd retry”* is not an answer. *“Exponential backoff with jitter, capped attempts, then a dead-letter queue”* is.",
          "**Is delivery idempotent?** Retries mean at-least-once. Without a stable key and a dedup check, every retry storm double-sends.",
          "**Does it run?** A fake channel you can *tell* to fail, a demo that prints one message retrying and another dying immediately, and a dead-letter queue you can read at the end.",
        ],
      },
    ],

    // ------------------------------------------------------------------
    howItWorks: [
      { type: "h", text: "Step 1 · Clarify — 5 minutes" },
      {
        type: "ul",
        items: [
          "**Which channels?** — email, SMS, push, and *“we might add WhatsApp”*. That last clause is the interviewer handing you the extensibility question. Take it.",
          "**Can a user turn things off?** — yes, per event type **and** per channel, plus quiet hours. This is the difference between a fan-out toy and a notification system.",
          "**What happens when a provider is down?** — say the word **retry** and then immediately say **bounded**, **backed off**, **jittered**, **dead-lettered**. Four words, and you have covered the whole second half of the hour.",
          "**Is delivery synchronous?** — no. Checkout must not wait on Twilio. Enqueue and return.",
          "**Do we need delivery receipts?** — yes for the design, because *“did it arrive?”* is a support question, so notifications carry a status.",
          "**Out of scope**: writing the actual SMTP/APNs client, the templating language itself, user auth, and the analytics warehouse. Say it in one sentence and move on.",
        ],
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 262" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A scope board. In scope: publish an event, resolve per-user per-channel preferences with quiet hours, per-channel templates, an async queue with priority lanes, pluggable channels, a three-way delivery result, retry with exponential backoff and jitter, a dead letter queue, idempotency keys and status tracking. Out of scope: writing real SMTP or APNs clients, a templating language, user authentication, analytics, marketing campaign targeting and internationalised copywriting.">
  <text x="14" y="22" font-size="10.5" fill="#5cc66f">✓ IN SCOPE — say these out loud in minute 3</text>
  <rect x="14" y="32" width="338" height="216" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <text x="30" y="56" font-size="9.5" fill="#e8e4dc">publish(event) — one call, no channel named</text>
  <text x="30" y="78" font-size="9.5" fill="#e8e4dc">preferences: user × eventType × channel</text>
  <text x="30" y="100" font-size="9.5" fill="#e8e4dc">quiet hours + per-category opt-out</text>
  <text x="30" y="122" font-size="9.5" fill="#e8e4dc">templates per (eventType, channel, locale)</text>
  <text x="30" y="144" font-size="9.5" fill="#e8e4dc">async queue + priority lanes</text>
  <text x="30" y="166" font-size="9.5" fill="#e8e4dc">Channel interface + 4 implementations</text>
  <text x="30" y="188" font-size="9.5" fill="#fb863a">DeliveryResult: ok / retryable / permanent</text>
  <text x="30" y="210" font-size="9.5" fill="#fb863a">backoff + jitter + cap + dead-letter queue</text>
  <text x="30" y="232" font-size="9.5" fill="#fb863a">idempotency key + status tracking</text>

  <text x="380" y="22" font-size="10.5" fill="#f06868">✗ OUT OF SCOPE — one sentence, then move on</text>
  <rect x="380" y="32" width="326" height="216" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="396" y="56" font-size="9.5" fill="#9099a8">a real SMTP / APNs / Twilio client</text>
  <text x="396" y="78" font-size="9.5" fill="#9099a8">the templating language itself</text>
  <text x="396" y="100" font-size="9.5" fill="#9099a8">user accounts and authentication</text>
  <text x="396" y="122" font-size="9.5" fill="#9099a8">analytics warehouse / reporting</text>
  <text x="396" y="144" font-size="9.5" fill="#9099a8">campaign targeting and segmentation</text>
  <text x="396" y="166" font-size="9.5" fill="#9099a8">writing the copy, in any language</text>
  <line x1="396" y1="182" x2="690" y2="182" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="396" y="204" font-size="9" fill="#6b7280">every one of these is a real system —</text>
  <text x="396" y="220" font-size="9" fill="#6b7280">saying so is what buys you the 40 minutes</text>
  <text x="396" y="236" font-size="9" fill="#6b7280">you need for retries and dedup</text>
</svg>`,
        caption:
          "Notice which lines are **orange**. Those three are the ones that separate this from a fan-out exercise — put them on the board early so the interviewer knows you are going there.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Do not spend the hour on fan-out plumbing",
        text: "It is very easy to build a tidy `for (channel : channels) channel.send(...)` loop, feel good, and run out of clock. That loop is ten minutes of work. The round is decided by what happens when one of those `send` calls **fails**, and by whether the sender was ever allowed to know the channel existed.",
      },

      { type: "h", text: "Step 2 · An event is not a notification" },
      {
        type: "p",
        text: "This is the single distinction the whole design hangs on. An **event** is a fact about the world: *order ORD-91 shipped, for user U-2*. A **notification** is a decision about a person: *send U-2 this exact SMS body*. The order service is qualified to state the fact. It is not qualified to make the decision, and it must not try.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 720 310" width="100%" style="max-width:700px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Left, the wrong design: OrderService calls emailClient.send with an address, subject and body, so it knows the user's email, the SMTP client, retries and opt-outs; adding WhatsApp means editing OrderService, PaymentService and ShippingService. Right, the correct design: OrderService publishes an OrderShipped event carrying only an order id and a user id, and the NotificationService resolves preferences and templates and dispatches to channels; adding WhatsApp is one new class plus preference rows and zero edits upstream.">
  <text x="14" y="22" font-size="10.5" fill="#f06868">✗ THE SENDER KNOWS THE CHANNEL</text>
  <rect x="14" y="32" width="330" height="230" rx="8" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <rect x="30" y="48" width="140" height="28" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="42" y="66" font-size="9.5" fill="#e8e4dc">OrderService</text>
  <line x1="100" y1="76" x2="100" y2="98" stroke="#f06868" stroke-width="1.3"/>
  <path d="M96,98 L104,98 L100,106 z" fill="#f06868"/>
  <rect x="30" y="108" width="298" height="26" rx="5" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="42" y="125" font-size="9" fill="#f06868">emailClient.send(user.email, subject, body)</text>
  <text x="30" y="156" font-size="9" fill="#9099a8">OrderService now owns:</text>
  <text x="42" y="174" font-size="9" fill="#f06868">the email address · the subject line</text>
  <text x="42" y="190" font-size="9" fill="#f06868">the SMTP client · retries on failure</text>
  <text x="42" y="206" font-size="9" fill="#f06868">the opt-out check · quiet hours</text>
  <line x1="30" y1="218" x2="328" y2="218" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="30" y="238" font-size="9.5" fill="#f06868">add WhatsApp → edit OrderService,</text>
  <text x="30" y="254" font-size="9.5" fill="#f06868">PaymentService, ShippingService, …</text>
  <text x="14" y="284" font-size="9.5" fill="#f06868">cost = every publisher × every channel</text>
  <text x="14" y="300" font-size="9" fill="#6b7280">and marketing cannot ship anything without you</text>

  <text x="376" y="22" font-size="10.5" fill="#5cc66f">✓ THE SENDER STATES A FACT</text>
  <rect x="376" y="32" width="330" height="230" rx="8" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <rect x="392" y="48" width="140" height="28" rx="5" fill="#1a1d22" stroke="#2d333d"/><text x="404" y="66" font-size="9.5" fill="#e8e4dc">OrderService</text>
  <line x1="462" y1="76" x2="462" y2="98" stroke="#5cc66f" stroke-width="1.3"/>
  <path d="M458,98 L466,98 L462,106 z" fill="#5cc66f"/>
  <rect x="392" y="108" width="298" height="26" rx="5" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="404" y="125" font-size="9" fill="#5cc66f">publish(new OrderShipped("ORD-91", "U-2"))</text>
  <text x="392" y="152" font-size="9" fill="#9099a8">that is the entire payload. downstream:</text>
  <rect x="392" y="162" width="90" height="24" rx="4" fill="#1a1d22" stroke="#5e9ff6"/><text x="400" y="178" font-size="8" fill="#5e9ff6">preferences</text>
  <rect x="490" y="162" width="90" height="24" rx="4" fill="#1a1d22" stroke="#5e9ff6"/><text x="498" y="178" font-size="8" fill="#5e9ff6">templates</text>
  <rect x="588" y="162" width="100" height="24" rx="4" fill="#1a1d22" stroke="#fb863a"/><text x="596" y="178" font-size="8" fill="#fb863a">channels</text>
  <text x="392" y="206" font-size="9" fill="#5cc66f">the event has no address, no subject,</text>
  <text x="392" y="222" font-size="9" fill="#5cc66f">and never the word “SMS”</text>
  <line x1="392" y1="232" x2="690" y2="232" stroke="#2d333d" stroke-dasharray="3 3"/>
  <text x="392" y="252" font-size="9.5" fill="#5cc66f">add WhatsApp → 1 class + preference rows</text>
  <text x="376" y="284" font-size="9.5" fill="#5cc66f">cost = 0 edits to any publisher</text>
  <text x="376" y="300" font-size="9" fill="#6b7280">marketing flips rows in a table and ships</text>
</svg>`,
        caption:
          "Count the edits on each side for *“also send it on WhatsApp”*. Left: every service that publishes anything. Right: one new class and some rows. That arithmetic is [[open-closed]] with a price tag attached.",
      },
      {
        type: "code",
        language: "java",
        filename: "the seam, in full",
        code: `// The publisher. It states a fact and stops.
class OrderService {
    private final NotificationService notifier;

    void markShipped(Order order) {
        shipments.record(order);
        notifier.publish(new Event(
            EventType.ORDER_SHIPPED,
            order.userId(),
            order.id(),                       // the entity, for the idempotency key
            Map.of("orderId", order.id())));  // template placeholders, nothing more
    }
}

// The decision maker. It is the ONLY class that knows channels exist.
class NotificationService {
    List<Notification> publish(Event event) {
        List<Notification> out = new ArrayList<>();
        for (ChannelType type : preferences.channelsFor(event.userId(), event.type())) {
            String body = templates.render(event.type(), type, event.data());
            Notification n = new Notification(
                event.userId() + ":" + event.type() + ":" + event.entityId(),  // dedup key
                event.userId(), type, body, Priority.of(event.type()));
            if (dedup.seen(n.key())) continue;   // at-least-once needs this
            queue.offer(n);                      // enqueue — do NOT send here
            out.add(n);
        }
        return out;
    }
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Why the event carries an entity id",
        text: "`OrderShipped(orderId, userId)` looks like it carries the order id only for the template. It does not — the order id is what makes the **idempotency key** stable across retries and duplicate publishes. `userId + eventType + entityId` is the same string every time this fact is restated, which is exactly what you need in Step 6.",
      },
      { type: "h", text: "Step 3 · Preferences decide who, and whether" },
      {
        type: "p",
        text: "One event does **not** mean one notification. It means *zero or more*, and the number is decided by data. The lookup is a three-part key — user, event type, channel — and the answer is a boolean.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 300" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A preference matrix with three users down the side and three event types across the top. Each cell holds three small pills for email, SMS and push, lit when enabled and dimmed when disabled. User U-2's OrderShipped cell has SMS and push lit and email dark, and is highlighted; a callout resolves that row into two notifications rather than three. A note explains that OTP ignores quiet hours while promotional traffic does not.">
  <text x="14" y="20" font-size="10.5" fill="#fb863a">UserPreference(userId, eventType, channel, enabled) — one row per cell pill</text>

  <text x="176" y="52" font-size="9.5" fill="#9099a8">OrderShipped</text>
  <text x="356" y="52" font-size="9.5" fill="#9099a8">OtpRequested</text>
  <text x="536" y="52" font-size="9.5" fill="#9099a8">PromoBlast</text>
  <text x="676" y="52" font-size="9" fill="#6b7280">E / S / P</text>

  <text x="20" y="90" font-size="10" fill="#e8e4dc">U-1</text>
  <rect x="60" y="66" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="72" y="76" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="84" y="89" font-size="8.5" fill="#5cc66f">📧 on</text>
  <rect x="122" y="76" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="132" y="89" font-size="8.5" fill="#6b7280">💬 off</text>
  <rect x="172" y="76" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="184" y="89" font-size="8.5" fill="#5cc66f">🔔 on</text>

  <rect x="240" y="66" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="252" y="76" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="264" y="89" font-size="8.5" fill="#5cc66f">📧 on</text>
  <rect x="302" y="76" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="314" y="89" font-size="8.5" fill="#5cc66f">💬 on</text>
  <rect x="352" y="76" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="362" y="89" font-size="8.5" fill="#6b7280">🔔 off</text>

  <rect x="420" y="66" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="432" y="76" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="444" y="89" font-size="8.5" fill="#5cc66f">📧 on</text>
  <rect x="482" y="76" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="492" y="89" font-size="8.5" fill="#6b7280">💬 off</text>
  <rect x="532" y="76" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="542" y="89" font-size="8.5" fill="#6b7280">🔔 off</text>

  <text x="20" y="142" font-size="10" fill="#fb863a">U-2</text>
  <rect x="60" y="118" width="164" height="36" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="72" y="128" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="82" y="141" font-size="8.5" fill="#6b7280">📧 off</text>
  <rect x="122" y="128" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="134" y="141" font-size="8.5" fill="#5cc66f">💬 on</text>
  <rect x="172" y="128" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="184" y="141" font-size="8.5" fill="#5cc66f">🔔 on</text>

  <rect x="240" y="118" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="252" y="128" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="262" y="141" font-size="8.5" fill="#6b7280">📧 off</text>
  <rect x="302" y="128" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="314" y="141" font-size="8.5" fill="#5cc66f">💬 on</text>
  <rect x="352" y="128" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="364" y="141" font-size="8.5" fill="#5cc66f">🔔 on</text>

  <rect x="420" y="118" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="432" y="128" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="442" y="141" font-size="8.5" fill="#6b7280">📧 off</text>
  <rect x="482" y="128" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="492" y="141" font-size="8.5" fill="#6b7280">💬 off</text>
  <rect x="532" y="128" width="42" height="18" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="542" y="141" font-size="8.5" fill="#6b7280">🔔 off</text>

  <text x="20" y="194" font-size="10" fill="#e8e4dc">U-3</text>
  <rect x="60" y="170" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="72" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="84" y="193" font-size="8.5" fill="#5cc66f">📧 on</text>
  <rect x="122" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="134" y="193" font-size="8.5" fill="#5cc66f">💬 on</text>
  <rect x="172" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="184" y="193" font-size="8.5" fill="#5cc66f">🔔 on</text>

  <rect x="240" y="170" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="252" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="264" y="193" font-size="8.5" fill="#5cc66f">📧 on</text>
  <rect x="302" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="314" y="193" font-size="8.5" fill="#5cc66f">💬 on</text>
  <rect x="352" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="364" y="193" font-size="8.5" fill="#5cc66f">🔔 on</text>

  <rect x="420" y="170" width="164" height="36" rx="5" fill="#14161a" stroke="#2d333d"/>
  <rect x="432" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="444" y="193" font-size="8.5" fill="#5cc66f">📧 on</text>
  <rect x="482" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="492" y="193" font-size="8.5" fill="#6b7280">💬 off</text>
  <rect x="532" y="180" width="42" height="18" rx="4" fill="rgba(92,198,111,0.16)" stroke="rgba(92,198,111,0.5)"/><text x="544" y="193" font-size="8.5" fill="#5cc66f">🔔 on</text>

  <rect x="600" y="112" width="128" height="48" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="610" y="130" font-size="9" fill="#fb863a">U-2 · OrderShipped</text>
  <text x="610" y="146" font-size="9" fill="#e8e4dc">→ SMS + push = 2</text>
  <text x="600" y="176" font-size="9" fill="#6b7280">not 3. the publisher</text>
  <text x="600" y="190" font-size="9" fill="#6b7280">never knew either way.</text>

  <line x1="14" y1="226" x2="726" y2="226" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="14" y="248" font-size="9.5" fill="#9099a8">Quiet hours 22:00–07:00 are a second filter on top of the matrix:</text>
  <text x="30" y="268" font-size="9.5" fill="#5cc66f">transactional (OTP, fraud alert) → ignores quiet hours, always sends</text>
  <text x="30" y="286" font-size="9.5" fill="#f06868">promotional → held until morning, or dropped if it has expired by then</text>
</svg>`,
        caption:
          "Every green pill is a **row in a table**. Read the highlighted cell: the same `publish()` call produces two notifications for U-2 and three for U-3, and no code anywhere had to change to make that true.",
      },
      {
        type: "ul",
        items: [
          "**Default to sensible, not to silent.** A missing row should mean *on* for transactional and *off* for promotional. Say which default you picked and why — it is a real product decision and interviewers notice when you make it deliberately.",
          "**A global unsubscribe outranks everything.** One flag on the user that short-circuits the whole matrix, checked first. Legally you want exactly one place that can be wrong.",
          "**Quiet hours are per user timezone**, not server time. One extra field, and forgetting it is how you wake somebody at 3am.",
          "**Never let quiet hours suppress an OTP.** Category matters: transactional bypasses, promotional does not. Encode the category on the event type, not in an `if` in the service.",
        ],
      },

      { type: "h", text: "Step 4 · Templates are data too — and they are per channel" },
      {
        type: "p",
        text: "The same fact reads completely differently in an inbox and on a lock screen. An email can be four paragraphs with a tracking link. An SMS gets **160 characters** and costs real money per segment beyond that. A push notification is a title plus about forty characters of body before the phone truncates it for you. So the template key is not `eventType` — it is `(eventType, channel, locale)`.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 320" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="One OrderShipped event with data fields flows into three template rows keyed by event type, channel and locale. The email row renders a full multi-line body with a tracking link, the SMS row renders a body clipped to one hundred and sixty characters, and the push row renders a short title plus a one-line body. A note says adding a language is a fourth row, not a deploy.">
  <rect x="14" y="16" width="212" height="70" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="26" y="36" font-size="10" fill="#fb863a">OrderShipped</text>
  <line x1="14" y1="44" x2="226" y2="44" stroke="#2d333d"/>
  <text x="26" y="62" font-size="9" fill="#e8e4dc">orderId = "ORD-91"</text>
  <text x="26" y="78" font-size="9" fill="#e8e4dc">userId  = "U-2"</text>
  <text x="14" y="106" font-size="9" fill="#6b7280">one event, one set of</text>
  <text x="14" y="120" font-size="9" fill="#6b7280">placeholder values</text>

  <text x="266" y="30" font-size="9.5" fill="#9099a8">Template rows — key: (eventType, channel, locale)</text>

  <rect x="266" y="42" width="150" height="48" rx="5" fill="#1a1d22" stroke="#5e9ff6"/>
  <text x="276" y="60" font-size="8.5" fill="#5e9ff6">ORDER_SHIPPED</text>
  <text x="276" y="74" font-size="8.5" fill="#9099a8">EMAIL · en</text>
  <text x="276" y="86" font-size="8" fill="#6b7280">"Your order {orderId}…"</text>

  <rect x="266" y="130" width="150" height="48" rx="5" fill="#1a1d22" stroke="#5e9ff6"/>
  <text x="276" y="148" font-size="8.5" fill="#5e9ff6">ORDER_SHIPPED</text>
  <text x="276" y="162" font-size="8.5" fill="#9099a8">SMS · en</text>
  <text x="276" y="174" font-size="8" fill="#6b7280">"{orderId} shipped."</text>

  <rect x="266" y="218" width="150" height="48" rx="5" fill="#1a1d22" stroke="#5e9ff6"/>
  <text x="276" y="236" font-size="8.5" fill="#5e9ff6">ORDER_SHIPPED</text>
  <text x="276" y="250" font-size="8.5" fill="#9099a8">PUSH · en</text>
  <text x="276" y="262" font-size="8" fill="#6b7280">"On its way 📦"</text>

  <line x1="226" y1="60" x2="260" y2="62" stroke="#fb863a" stroke-width="1.1" marker-end="url(#ns-flow2)"/>
  <line x1="226" y1="66" x2="260" y2="150" stroke="#fb863a" stroke-width="1.1" marker-end="url(#ns-flow2)"/>
  <line x1="226" y1="72" x2="260" y2="238" stroke="#fb863a" stroke-width="1.1" marker-end="url(#ns-flow2)"/>
  <defs>
    <marker id="ns-flow2" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
  </defs>

  <rect x="446" y="34" width="280" height="64" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="456" y="52" font-size="9" fill="#9099a8">📧 EMAIL — no practical limit</text>
  <text x="456" y="70" font-size="8.5" fill="#e8e4dc">Your order ORD-91 has shipped and is</text>
  <text x="456" y="84" font-size="8.5" fill="#e8e4dc">on its way. Track it here: sub.rt/ORD-91</text>

  <rect x="446" y="122" width="280" height="64" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="456" y="140" font-size="9" fill="#9099a8">💬 SMS — 160 chars, billed per segment</text>
  <text x="456" y="158" font-size="8.5" fill="#e8e4dc">ORD-91 shipped. Track: sub.rt/ORD-91</text>
  <text x="456" y="174" font-size="8" fill="#fb863a">36/160 — one segment, one charge</text>

  <rect x="446" y="210" width="280" height="64" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="456" y="228" font-size="9" fill="#9099a8">🔔 PUSH — title + a short line</text>
  <text x="456" y="246" font-size="8.5" fill="#e8e4dc">On its way 📦</text>
  <text x="456" y="262" font-size="8.5" fill="#9099a8">Order ORD-91 has shipped</text>

  <line x1="416" y1="66" x2="442" y2="66" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3"/>
  <line x1="416" y1="154" x2="442" y2="154" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3"/>
  <line x1="416" y1="242" x2="442" y2="242" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="3 3"/>

  <text x="14" y="300" font-size="9.5" fill="#5cc66f">A new event type is a new row. A new language is a new row. Neither is a deploy —</text>
  <text x="14" y="314" font-size="9.5" fill="#5cc66f">exactly the move the coffee machine made with its recipes.</text>
</svg>`,
        caption:
          "Three rows, one event, three bodies. Look at the **36/160** counter: the SMS template is short *on purpose*, because writing one long body and truncating it in code produces sentences that end mid-word. This is the same *“the variation is data, not classes”* move [[coffee-machine]] made with recipes.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Say this and the templating question is closed",
        text: "*“Templates are rows keyed by event type, channel and locale, with `{placeholder}` substitution. Adding an event type or a language is a row, not a release. And the renderer is per-channel, so the SMS copy is written short rather than clipped short.”* That is fifteen seconds and it covers internationalisation before they ask.",
      },
      { type: "h", text: "Step 5 · Channels behind one interface" },
      {
        type: "p",
        text: "`Channel.send(Notification) → DeliveryResult`. Four implementations, one method. Adding WhatsApp is a new class and some preference rows — the service does not change, because the service never names a channel. This is [[strategy]], and the tell that you got it right is that there is **no `switch` on a channel string anywhere**: the registry is a map from `ChannelType` to `Channel`, populated once at startup.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 430" width="100%" style="max-width:740px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A UML class diagram. NotificationService holds a PreferenceStore, a TemplateStore, a DedupStore and a NotificationQueue, and a registry of Channels. The Channel interface declares type and send returning a DeliveryResult, and is implemented by EmailChannel, SmsChannel, PushChannel and WhatsAppChannel. DeliveryResult is a sealed type with Success, Retryable and Permanent variants. A Dispatcher pulls Notifications from the queue, applies a RetryPolicy on retryable failures and pushes exhausted or permanent failures into a DeadLetterQueue.">
  <defs>
    <marker id="ns-arrow" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="9" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
    <marker id="ns-impl" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="10" refY="4" orient="auto"><path d="M1,0 L10,4 L1,8 z" fill="none" stroke="#5e9ff6" stroke-width="1.2"/></marker>
  </defs>

  <rect x="14" y="14" width="216" height="112" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="26" y="34" font-size="11" fill="#fb863a">NotificationService</text>
  <line x1="14" y1="42" x2="230" y2="42" stroke="#2d333d"/>
  <text x="26" y="60" font-size="9" fill="#9099a8">- prefs : PreferenceStore</text>
  <text x="26" y="76" font-size="9" fill="#9099a8">- templates : TemplateStore</text>
  <text x="26" y="92" font-size="9" fill="#9099a8">- dedup : DedupStore</text>
  <text x="26" y="108" font-size="9" fill="#e8e4dc">+ publish(Event) : int</text>
  <text x="26" y="122" font-size="8.5" fill="#6b7280">never names a channel</text>

  <rect x="14" y="164" width="216" height="82" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="26" y="184" font-size="11" fill="#e8e4dc">NotificationQueue</text>
  <line x1="14" y1="192" x2="230" y2="192" stroke="#2d333d"/>
  <text x="26" y="210" font-size="9" fill="#9099a8">ordered by (priority, readyAt)</text>
  <text x="26" y="226" font-size="9" fill="#e8e4dc">+ offer(n) / + poll()</text>
  <text x="26" y="240" font-size="8.5" fill="#6b7280">OTP never waits behind promo</text>
  <line x1="122" y1="126" x2="122" y2="160" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-arrow)"/>

  <rect x="14" y="284" width="216" height="96" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="26" y="304" font-size="11" fill="#e8e4dc">Dispatcher</text>
  <text x="150" y="304" font-size="8.5" fill="#6b7280">«worker»</text>
  <line x1="14" y1="312" x2="230" y2="312" stroke="#2d333d"/>
  <text x="26" y="330" font-size="9" fill="#e8e4dc">+ runOnce()</text>
  <text x="26" y="346" font-size="8.5" fill="#9099a8">poll → channel.send → route</text>
  <text x="26" y="362" font-size="8.5" fill="#9099a8">the result: ack / retry / DLQ</text>
  <line x1="122" y1="246" x2="122" y2="280" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-arrow)"/>

  <rect x="286" y="14" width="196" height="76" rx="6" fill="#14161a" stroke="#5e9ff6" stroke-width="1.3"/>
  <text x="298" y="34" font-size="11" fill="#5e9ff6">Channel</text>
  <text x="404" y="34" font-size="8.5" fill="#6b7280">«interface»</text>
  <line x1="286" y1="42" x2="482" y2="42" stroke="#2d333d"/>
  <text x="298" y="60" font-size="9" fill="#e8e4dc">+ type() : ChannelType</text>
  <text x="298" y="78" font-size="9" fill="#fb863a">+ send(n) : DeliveryResult</text>
  <line x1="238" y1="60" x2="282" y2="52" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-arrow)"/>
  <text x="234" y="82" font-size="8" fill="#6b7280">registry map</text>

  <rect x="286" y="122" width="90" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="294" y="141" font-size="8.5" fill="#e8e4dc">EmailChannel</text>
  <rect x="286" y="160" width="90" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="294" y="179" font-size="8.5" fill="#e8e4dc">SmsChannel</text>
  <rect x="392" y="122" width="90" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="400" y="141" font-size="8.5" fill="#e8e4dc">PushChannel</text>
  <rect x="392" y="160" width="90" height="30" rx="5" fill="#14161a" stroke="#2d333d"/><text x="398" y="179" font-size="8" fill="#e8e4dc">WhatsAppChannel</text>
  <line x1="331" y1="122" x2="360" y2="94" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#ns-impl)"/>
  <line x1="331" y1="160" x2="366" y2="96" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3" opacity=".55"/>
  <line x1="437" y1="122" x2="410" y2="94" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#ns-impl)"/>
  <line x1="437" y1="160" x2="404" y2="96" stroke="#5e9ff6" stroke-width="1.1" stroke-dasharray="4 3" opacity=".55"/>
  <text x="286" y="212" font-size="8.5" fill="#5cc66f">a 5th channel is a 5th box —</text>
  <text x="286" y="226" font-size="8.5" fill="#5cc66f">nothing to the left changes</text>

  <rect x="286" y="252" width="196" height="128" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="298" y="272" font-size="11" fill="#fb863a">DeliveryResult</text>
  <text x="410" y="272" font-size="8.5" fill="#6b7280">«sealed»</text>
  <line x1="286" y1="280" x2="482" y2="280" stroke="#2d333d"/>
  <rect x="298" y="290" width="172" height="24" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="308" y="306" font-size="8.5" fill="#5cc66f">Success(providerId)</text>
  <rect x="298" y="320" width="172" height="24" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="308" y="336" font-size="8.5" fill="#fb863a">Retryable(reason) → backoff</text>
  <rect x="298" y="350" width="172" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/><text x="308" y="366" font-size="8.5" fill="#f06868">Permanent(reason) → DLQ</text>
  <line x1="384" y1="248" x2="384" y2="196" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="4 3"/>

  <rect x="536" y="14" width="210" height="86" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="548" y="34" font-size="11" fill="#e8e4dc">Notification</text>
  <line x1="536" y1="42" x2="746" y2="42" stroke="#2d333d"/>
  <text x="548" y="60" font-size="9" fill="#fb863a">- key : String   «idempotency»</text>
  <text x="548" y="76" font-size="9" fill="#9099a8">- userId, channel, body</text>
  <text x="548" y="92" font-size="9" fill="#9099a8">- priority, attempt, status</text>

  <rect x="536" y="132" width="210" height="92" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="548" y="152" font-size="11" fill="#e8e4dc">RetryPolicy</text>
  <line x1="536" y1="160" x2="746" y2="160" stroke="#2d333d"/>
  <text x="548" y="178" font-size="9" fill="#9099a8">- baseDelay, maxDelay, maxAttempts</text>
  <text x="548" y="196" font-size="9" fill="#fb863a">+ delayFor(attempt) — 2^n + jitter</text>
  <text x="548" y="214" font-size="8.5" fill="#6b7280">injectable, so tests are deterministic</text>

  <rect x="536" y="256" width="210" height="76" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <text x="548" y="276" font-size="11" fill="#f06868">DeadLetterQueue</text>
  <line x1="536" y1="284" x2="746" y2="284" stroke="#2d333d"/>
  <text x="548" y="302" font-size="9" fill="#9099a8">+ add(notification, reason)</text>
  <text x="548" y="320" font-size="8.5" fill="#6b7280">a human or a batch job reads this</text>

  <rect x="536" y="356" width="210" height="52" rx="6" fill="#14161a" stroke="#3a414c"/>
  <text x="548" y="376" font-size="10.5" fill="#e8e4dc">PreferenceStore · TemplateStore</text>
  <text x="548" y="394" font-size="8.5" fill="#5cc66f">both back onto plain rows</text>

  <line x1="230" y1="330" x2="282" y2="330" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-arrow)"/>
  <line x1="482" y1="180" x2="532" y2="180" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-arrow)"/>
  <line x1="482" y1="292" x2="532" y2="292" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-arrow)"/>
</svg>`,
        caption:
          "Two boxes carry the round. **`DeliveryResult` with three variants**, and **`RetryPolicy` as an injected object** rather than a hardcoded `Thread.sleep`. Everything else here is bookkeeping. Notation: [[class-diagrams]].",
      },
      {
        type: "p",
        text: "The thing beginners miss is that channels are not interchangeable in *behaviour*, only in *shape*. SMS has a hard 160-character segment and a per-message cost. Push needs a device token that goes stale the moment the user reinstalls the app. Email bounces — sometimes because the mailbox is full and sometimes because the address does not exist, and those two are not the same event. So a boolean return type throws away the only information the caller needs.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 320" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A fork diagram of the three delivery outcomes. channel.send returns either Success, which marks the notification sent and acknowledges it; Retryable, for a timeout, a 503 or a rate limit, which goes to the backoff queue with the attempt count incremented; or Permanent, for an invalid number, an unsubscribed user or a hard bounce, which goes straight to the dead letter queue. A red cross marks the forbidden path of retrying a permanent failure, with a note that it burns the provider quota forever and can never succeed.">
  <rect x="14" y="128" width="150" height="46" rx="6" fill="#14161a" stroke="#fb863a" stroke-width="1.3"/>
  <text x="26" y="148" font-size="10" fill="#fb863a">channel.send(n)</text>
  <text x="26" y="164" font-size="8.5" fill="#9099a8">returns DeliveryResult</text>

  <path d="M164,142 L214,58" fill="none" stroke="#5cc66f" stroke-width="1.3" marker-end="url(#ns-ok)"/>
  <path d="M164,151 L214,151" fill="none" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-warn)"/>
  <path d="M164,160 L214,248" fill="none" stroke="#f06868" stroke-width="1.3" marker-end="url(#ns-bad)"/>
  <defs>
    <marker id="ns-ok" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="ns-warn" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="ns-bad" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <rect x="220" y="24" width="212" height="66" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.5)"/>
  <text x="232" y="44" font-size="10" fill="#5cc66f">SUCCESS</text>
  <text x="232" y="62" font-size="8.5" fill="#9099a8">provider accepted it</text>
  <text x="232" y="78" font-size="8.5" fill="#e8e4dc">status → SENT · dedup key stored</text>
  <rect x="466" y="34" width="120" height="46" rx="6" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="478" y="54" font-size="9" fill="#5cc66f">done ✓</text>
  <text x="478" y="70" font-size="8" fill="#9099a8">await delivery receipt</text>
  <line x1="432" y1="57" x2="462" y2="57" stroke="#5cc66f" stroke-width="1.2" marker-end="url(#ns-ok)"/>

  <rect x="220" y="118" width="212" height="66" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)"/>
  <text x="232" y="138" font-size="10" fill="#fb863a">RETRYABLE</text>
  <text x="232" y="156" font-size="8.5" fill="#9099a8">timeout · 503 · 429 rate limited</text>
  <text x="232" y="172" font-size="8.5" fill="#e8e4dc">the world might be fine in 2 seconds</text>
  <rect x="466" y="118" width="164" height="66" rx="6" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="478" y="138" font-size="9" fill="#fb863a">backoff queue</text>
  <text x="478" y="155" font-size="8.5" fill="#9099a8">attempt++ · readyAt = now + d</text>
  <text x="478" y="172" font-size="8.5" fill="#f06868">attempt &gt; max → DLQ</text>
  <line x1="432" y1="151" x2="462" y2="151" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-warn)"/>

  <rect x="220" y="212" width="212" height="66" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/>
  <text x="232" y="232" font-size="10" fill="#f06868">PERMANENT</text>
  <text x="232" y="250" font-size="8.5" fill="#9099a8">invalid number · unsubscribed</text>
  <text x="232" y="266" font-size="8.5" fill="#9099a8">hard bounce · dead device token</text>
  <rect x="466" y="212" width="164" height="66" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="478" y="232" font-size="9" fill="#f06868">dead-letter queue</text>
  <text x="478" y="249" font-size="8.5" fill="#9099a8">immediately · zero retries</text>
  <text x="478" y="266" font-size="8.5" fill="#e8e4dc">someone fixes the data</text>
  <line x1="432" y1="245" x2="462" y2="245" stroke="#f06868" stroke-width="1.2" marker-end="url(#ns-bad)"/>

  <path d="M326,278 C300,300 560,300 548,190" fill="none" stroke="#f06868" stroke-width="1.2" stroke-dasharray="4 4"/>
  <text x="352" y="304" font-size="16" fill="#f06868">✗</text>
  <text x="372" y="304" font-size="9" fill="#f06868">retrying a permanent failure: it can never succeed, it burns quota forever, and it is a real incident</text>

  <text x="646" y="140" font-size="9" fill="#6b7280">a boolean</text>
  <text x="646" y="154" font-size="9" fill="#6b7280">cannot tell</text>
  <text x="646" y="168" font-size="9" fill="#6b7280">these apart</text>
</svg>`,
        caption:
          "The dashed red curve is the mistake. *“Invalid phone number”* will still be an invalid phone number after eight retries — the only thing you achieve is spending your provider quota on a message that cannot be delivered.",
      },
      {
        type: "code",
        language: "java",
        filename: "the three-way result",
        code: `sealed interface DeliveryResult {
    record Success(String providerId) implements DeliveryResult {}
    record Retryable(String reason) implements DeliveryResult {}   // timeout, 503, 429
    record Permanent(String reason) implements DeliveryResult {}   // bad number, unsubscribed
}

class SmsChannel implements Channel {
    public DeliveryResult send(Notification n) {
        if (!isValidNumber(n.destination()))
            return new DeliveryResult.Permanent("invalid number");   // NEVER retry this
        String body = n.body();
        if (body.length() > 160) body = body.substring(0, 157) + "...";  // 1 segment, 1 charge
        try {
            return new DeliveryResult.Success(provider.send(n.destination(), body));
        } catch (RateLimitedException | TimeoutException | ServerBusyException e) {
            return new DeliveryResult.Retryable(e.getMessage());     // the world may recover
        }
    }
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "The classification lives in the channel, not the dispatcher",
        text: "Only the SMS channel knows that a Twilio `21211` means *bad number* and a `429` means *slow down*. If the dispatcher has to parse provider error codes, you have leaked one provider's vocabulary into shared code — and the second provider will not use the same numbers. The channel translates; the dispatcher only reads the three-way answer.",
      },
      { type: "h", text: "Step 6 · Retry, backoff, jitter, dead-letter — the second act" },
      {
        type: "p",
        text: "A send fails. You do **not** fail the caller — the caller was a warehouse service that finished its job twenty seconds ago. You put the message back on the queue with a **later ready time**, and you make each wait longer than the last: 1s, 2s, 4s, 8s. That is exponential backoff, and most candidates stop there. Stopping there is how you take down your own provider.",
      },
      {
        type: "p",
        text: "Here is why. A provider blips and a thousand messages fail **in the same second**. With pure exponential backoff, all thousand wait exactly one second and all thousand retry **in the same instant** — a synchronised wall of traffic hitting a service that was already struggling. It fails again, and now all thousand wait two seconds together. You have built a metronome that hammers the provider harder each round. **Jitter** is the fix: randomise each delay inside a window so the retries spread out instead of arriving as a spike.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 400" width="100%" style="max-width:740px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Top: a time ruler from zero to sixteen seconds. Attempt one fires at zero and fails. Retries follow at roughly one, two, four and eight seconds, each drawn as a widening band showing the jitter window between half the base delay and the base delay. A max attempts line sits after the fourth retry, and the message falls into the dead letter queue. Bottom: two strips comparing a thousand messages retrying. Without jitter every retry lands on the same tick as one tall spike. With jitter the same retries spread evenly across the window as a low flat band.">
  <text x="14" y="20" font-size="10.5" fill="#fb863a">ONE MESSAGE, FOUR ATTEMPTS, THEN THE DEAD-LETTER QUEUE</text>

  <line x1="40" y1="120" x2="700" y2="120" stroke="#3a414c" stroke-width="1.2"/>
  <text x="34" y="140" font-size="8.5" fill="#6b7280">0s</text>
  <line x1="40" y1="114" x2="40" y2="126" stroke="#6b7280"/>
  <line x1="122" y1="114" x2="122" y2="126" stroke="#6b7280"/><text x="114" y="140" font-size="8.5" fill="#6b7280">1s</text>
  <line x1="204" y1="114" x2="204" y2="126" stroke="#6b7280"/><text x="196" y="140" font-size="8.5" fill="#6b7280">2s</text>
  <line x1="368" y1="114" x2="368" y2="126" stroke="#6b7280"/><text x="360" y="140" font-size="8.5" fill="#6b7280">4s</text>
  <line x1="696" y1="114" x2="696" y2="126" stroke="#6b7280"/><text x="686" y="140" font-size="8.5" fill="#6b7280">8s</text>

  <rect x="34" y="80" width="12" height="34" rx="2" fill="rgba(240,104,104,0.5)" stroke="#f06868"/>
  <text x="20" y="72" font-size="8.5" fill="#f06868">attempt 1</text>
  <text x="20" y="60" font-size="8" fill="#9099a8">fails</text>

  <rect x="82" y="80" width="44" height="34" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="118" y="80" width="8" height="34" rx="2" fill="rgba(240,104,104,0.5)" stroke="#f06868"/>
  <text x="72" y="72" font-size="8.5" fill="#fb863a">attempt 2</text>
  <text x="72" y="60" font-size="8" fill="#9099a8">wait 0.5–1s</text>

  <rect x="146" y="80" width="62" height="34" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="200" y="80" width="8" height="34" rx="2" fill="rgba(240,104,104,0.5)" stroke="#f06868"/>
  <text x="146" y="72" font-size="8.5" fill="#fb863a">attempt 3</text>
  <text x="146" y="60" font-size="8" fill="#9099a8">wait 1–2s</text>

  <rect x="248" y="80" width="124" height="34" rx="3" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <rect x="364" y="80" width="8" height="34" rx="2" fill="rgba(240,104,104,0.5)" stroke="#f06868"/>
  <text x="248" y="72" font-size="8.5" fill="#fb863a">attempt 4</text>
  <text x="248" y="60" font-size="8" fill="#9099a8">wait 2–4s</text>

  <rect x="412" y="80" width="284" height="34" rx="3" fill="rgba(251,134,58,0.08)" stroke="rgba(251,134,58,0.3)" stroke-dasharray="4 4"/>
  <text x="412" y="72" font-size="8.5" fill="#6b7280">attempt 5 would wait 4–8s — but maxAttempts = 4</text>

  <line x1="392" y1="34" x2="392" y2="160" stroke="#f06868" stroke-width="1.3" stroke-dasharray="5 4"/>
  <text x="400" y="32" font-size="9" fill="#f06868">maxAttempts reached</text>

  <rect x="400" y="164" width="220" height="40" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.5)"/>
  <text x="412" y="182" font-size="9.5" fill="#f06868">→ DeadLetterQueue</text>
  <text x="412" y="197" font-size="8.5" fill="#9099a8">with the last reason, and the attempt trail</text>

  <text x="14" y="182" font-size="8.5" fill="#5cc66f">orange band =</text>
  <text x="14" y="194" font-size="8.5" fill="#5cc66f">the jitter window</text>
  <text x="14" y="206" font-size="8.5" fill="#6b7280">[0.5·base, base]</text>

  <line x1="14" y1="228" x2="746" y2="228" stroke="#2d333d" stroke-dasharray="4 4"/>

  <text x="14" y="252" font-size="10.5" fill="#fb863a">WHY JITTER — 1000 MESSAGES THAT ALL FAILED AT THE SAME INSTANT</text>

  <text x="14" y="276" font-size="9" fill="#f06868">✗ no jitter</text>
  <rect x="90" y="262" width="620" height="46" rx="5" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <line x1="100" y1="304" x2="700" y2="304" stroke="#2d333d"/>
  <rect x="176" y="268" width="10" height="36" rx="2" fill="#f06868"/>
  <text x="192" y="284" font-size="8.5" fill="#f06868">all 1000 retry on the same tick — a wall of traffic</text>
  <text x="192" y="298" font-size="8" fill="#9099a8">the provider was already struggling. now it is down.</text>

  <text x="14" y="336" font-size="9" fill="#5cc66f">✓ jitter</text>
  <rect x="90" y="322" width="620" height="46" rx="5" fill="#14161a" stroke="rgba(92,198,111,0.45)"/>
  <line x1="100" y1="364" x2="700" y2="364" stroke="#2d333d"/>
  <rect x="120" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="152" y="354" width="8" height="10" rx="1" fill="#5cc66f"/>
  <rect x="186" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="218" y="353" width="8" height="11" rx="1" fill="#5cc66f"/>
  <rect x="252" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="286" y="354" width="8" height="10" rx="1" fill="#5cc66f"/>
  <rect x="320" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="354" y="353" width="8" height="11" rx="1" fill="#5cc66f"/>
  <rect x="388" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="422" y="355" width="8" height="9" rx="1" fill="#5cc66f"/>
  <rect x="456" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="490" y="354" width="8" height="10" rx="1" fill="#5cc66f"/>
  <rect x="524" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="558" y="355" width="8" height="9" rx="1" fill="#5cc66f"/>
  <rect x="592" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <rect x="626" y="354" width="8" height="10" rx="1" fill="#5cc66f"/>
  <rect x="660" y="356" width="8" height="8" rx="1" fill="#5cc66f"/>
  <text x="120" y="342" font-size="8.5" fill="#5cc66f">the same 1000 retries, spread across the window — the provider survives them</text>

  <text x="14" y="390" font-size="9" fill="#9099a8">Same number of retries. Same total delay budget. Completely different load on the thing you are retrying against.</text>
</svg>`,
        caption:
          "The bottom half is the whole argument. **Jitter does not reduce retries — it de-synchronises them.** Say that sentence and you are past every candidate who only said *“exponential backoff”*.",
      },
      {
        type: "code",
        language: "java",
        filename: "RetryPolicy + the dispatcher loop",
        code: `class RetryPolicy {
    private final long baseMillis, maxMillis;
    private final int maxAttempts;
    private final Random random;          // injected → tests are deterministic

    /** Equal jitter: half the delay is fixed, half is random. Never zero, never synchronised. */
    long delayFor(int attempt) {
        long base = Math.min(maxMillis, baseMillis * (1L << (attempt - 1)));  // 1s, 2s, 4s, 8s
        return base / 2 + (long) (random.nextDouble() * (base / 2.0));        // [0.5b, b]
    }
    boolean exhausted(int attempt) { return attempt >= maxAttempts; }
}

class Dispatcher {
    void runOnce(long now) {
        Notification n = queue.poll(now);            // respects priority AND readyAt
        if (n == null) return;

        DeliveryResult result = channels.get(n.channel()).send(n);

        if (result instanceof DeliveryResult.Success s) {
            n.markSent(s.providerId());
        } else if (result instanceof DeliveryResult.Permanent p) {
            deadLetters.add(n, p.reason());          // ZERO retries — it can never succeed
        } else if (result instanceof DeliveryResult.Retryable r) {
            if (policy.exhausted(n.attempt())) {
                deadLetters.add(n, "exhausted after " + n.attempt() + ": " + r.reason());
            } else {
                n.nextAttempt(now + policy.delayFor(n.attempt()));
                queue.offer(n);                      // back on the queue, later
            }
        }
    }
}`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Retry only what you did not already do",
        text: "Retrying is safe only if the *previous* attempt genuinely did nothing. A timeout is the awkward case: the provider may have accepted the message and lost the reply. That is why at-least-once delivery needs the next section — the retry is going to send twice sometimes, and the only defence is a key.",
      },

      { type: "h", text: "Idempotency — the sentence to say out loud" },
      {
        type: "p",
        text: "***“At-least-once delivery plus idempotency.”*** Retries mean a message can go out twice. You cannot prevent that at the network level, so you make the duplicate **harmless**: every notification carries a stable key — `userId + eventType + entityId` — and the send path checks it before doing anything. Same order, same user, same event, same key, no second SMS.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 250" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="The same OrderShipped event is published twice, perhaps because the upstream service retried. Both produce the identical key U-2 colon ORDER_SHIPPED colon ORD-91. The first passes the dedup check, is enqueued and delivered. The second hits the dedup check, is short-circuited, and no channel is called. A note says the key must come from the event, never from a timestamp or a random id.">
  <defs>
    <marker id="ns-dok" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#5cc66f"/></marker>
    <marker id="ns-dwarn" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="ns-dbad" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>
  <rect x="14" y="30" width="176" height="52" rx="6" fill="#14161a" stroke="#2d333d"/>
  <text x="26" y="50" font-size="9.5" fill="#e8e4dc">publish(OrderShipped</text>
  <text x="26" y="66" font-size="9.5" fill="#e8e4dc">  "ORD-91", "U-2")</text>
  <text x="14" y="24" font-size="9" fill="#9099a8">first publish</text>

  <rect x="14" y="132" width="176" height="52" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.4)"/>
  <text x="26" y="152" font-size="9.5" fill="#e8e4dc">publish(OrderShipped</text>
  <text x="26" y="168" font-size="9.5" fill="#e8e4dc">  "ORD-91", "U-2")</text>
  <text x="14" y="126" font-size="9" fill="#f06868">upstream retried — identical event</text>

  <rect x="226" y="66" width="230" height="34" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="238" y="88" font-size="9.5" fill="#fb863a">key = "U-2:ORDER_SHIPPED:ORD-91"</text>
  <rect x="226" y="116" width="230" height="34" rx="5" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="238" y="138" font-size="9.5" fill="#fb863a">key = "U-2:ORDER_SHIPPED:ORD-91"</text>
  <text x="226" y="166" font-size="9" fill="#9099a8">same inputs → same key. no clock, no UUID.</text>

  <line x1="190" y1="56" x2="222" y2="80" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-dwarn)"/>
  <line x1="190" y1="158" x2="222" y2="136" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-dwarn)"/>

  <rect x="492" y="20" width="120" height="40" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="502" y="45" font-size="9" fill="#e8e4dc">dedup.seen(key)?</text>
  <line x1="456" y1="82" x2="488" y2="52" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-dwarn)"/>

  <rect x="642" y="16" width="86" height="24" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/>
  <text x="652" y="32" font-size="8.5" fill="#5cc66f">no → enqueue</text>
  <line x1="612" y1="30" x2="638" y2="28" stroke="#5cc66f" stroke-width="1.2" marker-end="url(#ns-dok)"/>
  <text x="642" y="58" font-size="8.5" fill="#5cc66f">💬 SMS sent</text>

  <rect x="492" y="118" width="120" height="40" rx="5" fill="#14161a" stroke="#2d333d"/>
  <text x="502" y="143" font-size="9" fill="#e8e4dc">dedup.seen(key)?</text>
  <line x1="456" y1="133" x2="488" y2="136" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-dwarn)"/>

  <rect x="642" y="112" width="86" height="24" rx="4" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.45)"/>
  <text x="650" y="128" font-size="8.5" fill="#f06868">yes → drop</text>
  <line x1="612" y1="130" x2="638" y2="126" stroke="#f06868" stroke-width="1.2" marker-end="url(#ns-dbad)"/>
  <text x="642" y="152" font-size="8.5" fill="#6b7280">no channel called</text>
  <text x="642" y="166" font-size="8.5" fill="#6b7280">no second SMS</text>

  <line x1="14" y1="196" x2="726" y2="196" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="14" y="216" font-size="9.5" fill="#f06868">✗ key = UUID.randomUUID() or now() → every duplicate looks new, and dedup does nothing at all</text>
  <text x="14" y="236" font-size="9.5" fill="#5cc66f">✓ key derived from the event's own identity → the same fact always produces the same key</text>
</svg>`,
        caption:
          "The whole mechanism is one lookup before the enqueue. What makes it work is that the key is **derived**, not generated — read the two lines at the bottom, because generating the key is the mistake that quietly disables the entire defence.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Where the dedup key lives, and for how long",
        text: "In an interview: a `Set` with a TTL, or a Redis `SETNX` with an expiry in a real system. You do not keep keys forever — a few days is enough to cover any retry window. Mention the TTL unprompted; it is the difference between *“I've read about idempotency”* and *“I've operated it”*.",
      },
      { type: "h", text: "Step 7 · Enqueue, never send inline" },
      {
        type: "p",
        text: "`publish()` must not call `channel.send()`. If it does, a slow SMS provider is now inside your checkout request, and a five-second timeout at Twilio becomes a five-second checkout. `publish()` resolves, renders, dedupes and **offers to a queue**; a pool of workers drains it. That is [[producer-consumer]] with a very concrete payoff, and the retry machinery in Step 6 only works at all because there is a queue to put things back on. Size the pool with [[thread-pools-and-executors]], not with a thread per message.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 760 380" width="100%" style="max-width:740px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A sequence diagram across OrderService, NotificationService, the preference and template stores, the queue, a worker and the SMS channel. OrderService publishes an event and returns immediately. NotificationService resolves preferences, renders a template per channel, checks the dedup key and offers to the queue. Later a worker polls, calls send on the SMS channel, receives a retryable failure, computes a backoff delay and re-offers the notification. On a second poll the send succeeds and the notification is marked sent.">
  <defs>
    <marker id="ns-call" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#fb863a"/></marker>
    <marker id="ns-ret" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M1,0 L9,3 L1,6" fill="none" stroke="#9099a8" stroke-width="1.3"/></marker>
  </defs>

  <rect x="8" y="10" width="98" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="20" y="29" font-size="9" fill="#e8e4dc">OrderService</text>
  <rect x="140" y="10" width="118" height="28" rx="5" fill="#14161a" stroke="#fb863a"/><text x="150" y="29" font-size="9" fill="#fb863a">NotificationSvc</text>
  <rect x="298" y="10" width="112" height="28" rx="5" fill="#14161a" stroke="#5e9ff6"/><text x="306" y="29" font-size="9" fill="#5e9ff6">prefs+templates</text>
  <rect x="452" y="10" width="86" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="470" y="29" font-size="9" fill="#e8e4dc">Queue</text>
  <rect x="576" y="10" width="80" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="594" y="29" font-size="9" fill="#e8e4dc">Worker</text>
  <rect x="676" y="10" width="80" height="28" rx="5" fill="#14161a" stroke="#3a414c"/><text x="688" y="29" font-size="9" fill="#e8e4dc">SmsChannel</text>

  <line x1="57" y1="38" x2="57" y2="360" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="199" y1="38" x2="199" y2="360" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="354" y1="38" x2="354" y2="360" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="495" y1="38" x2="495" y2="360" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="616" y1="38" x2="616" y2="360" stroke="#2d333d" stroke-dasharray="4 5"/>
  <line x1="716" y1="38" x2="716" y2="360" stroke="#2d333d" stroke-dasharray="4 5"/>

  <text x="64" y="60" font-size="9" fill="#e8e4dc">publish(OrderShipped)</text>
  <line x1="57" y1="68" x2="195" y2="68" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-call)"/>

  <text x="206" y="88" font-size="9" fill="#e8e4dc">channelsFor(U-2, ORDER_SHIPPED)</text>
  <line x1="199" y1="96" x2="350" y2="96" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-call)"/>
  <text x="220" y="116" font-size="9" fill="#5cc66f">[SMS, PUSH] — email is off</text>
  <line x1="354" y1="124" x2="203" y2="124" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#ns-ret)"/>

  <text x="206" y="144" font-size="9" fill="#e8e4dc">render(event, channel) × 2</text>
  <line x1="199" y1="152" x2="350" y2="152" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-call)"/>
  <text x="220" y="172" font-size="9" fill="#9099a8">a 160-char body + a push body</text>
  <line x1="354" y1="180" x2="203" y2="180" stroke="#9099a8" stroke-width="1.1" stroke-dasharray="5 4" marker-end="url(#ns-ret)"/>

  <rect x="150" y="188" width="120" height="26" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/>
  <text x="158" y="205" font-size="8.5" fill="#fb863a">dedup.seen(key)? no</text>

  <text x="502" y="228" font-size="9" fill="#e8e4dc">offer(n) × 2</text>
  <line x1="199" y1="236" x2="491" y2="236" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-call)"/>
  <line x1="199" y1="252" x2="61" y2="252" stroke="#5cc66f" stroke-width="1.2" stroke-dasharray="5 4" marker-end="url(#ns-ret)"/>
  <text x="70" y="248" font-size="9" fill="#5cc66f">returns in microseconds — checkout is not waiting</text>

  <line x1="14" y1="266" x2="746" y2="266" stroke="#2d333d" stroke-dasharray="3 6"/>
  <text x="14" y="280" font-size="8.5" fill="#6b7280">…later, on a worker thread…</text>

  <line x1="616" y1="292" x2="499" y2="292" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-call)"/>
  <text x="510" y="288" font-size="9" fill="#e8e4dc">poll()</text>
  <line x1="616" y1="308" x2="712" y2="308" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-call)"/>
  <text x="622" y="304" font-size="9" fill="#e8e4dc">send(n)</text>
  <line x1="716" y1="326" x2="620" y2="326" stroke="#f06868" stroke-width="1.2" stroke-dasharray="5 4"/>
  <text x="560" y="322" font-size="9" fill="#f06868">Retryable("503")</text>

  <line x1="616" y1="346" x2="499" y2="346" stroke="#fb863a" stroke-width="1.3" marker-end="url(#ns-call)"/>
  <text x="440" y="342" font-size="9" fill="#fb863a">offer(n, readyAt = now + jitter(2^1))</text>
  <text x="440" y="360" font-size="8.5" fill="#6b7280">attempt 2 of 4 — nobody upstream ever hears about this</text>
</svg>`,
        caption:
          "Read the green return arrow. `publish()` is **already done** before a single byte leaves for the SMS provider — and the retry at the bottom happens entirely below that line, invisible to the order service. Notation: [[sequence-diagrams]].",
      },
      { type: "h", text: "Priority: an OTP must not queue behind a marketing blast" },
      {
        type: "p",
        text: "Marketing schedules 200,000 promos at 09:00. At 09:00:02 somebody tries to log in and needs an OTP. If both land in one FIFO queue, that OTP is delivered some time after lunch and the user is locked out. The rule is short: **transactional traffic never shares a lane with promotional traffic.**",
      },
      {
        type: "ul",
        items: [
          "**Separate queues per class** (transactional / transactional-bulk / promotional) with dedicated workers is the simplest answer and the one that cannot starve — each lane has guaranteed capacity.",
          "**A single priority queue** ordered by `(priority, readyAt)` is fine at interview scale and is what the prototype does, but say the word **starvation** unprompted: an endless stream of high-priority work never lets the low lane run. The fix is a floor — reserve some workers for the low lane, or age priority upward.",
          "**Priority comes from the event type, not the caller.** `Priority.of(OTP) = HIGH` lives in one table. Letting each publisher declare its own priority means everything is urgent within a month.",
          "**Retries keep their original priority** but go to the back of their own lane — a failing OTP still outranks a fresh promo.",
        ],
      },
      { type: "h", text: "Rate limiting, batching, and digests" },
      {
        type: "ul",
        items: [
          "**Per-user throttling** is a safety net against your own bugs: a loop that fires 500 pushes at one person is a support incident and an app uninstall. Cap it — *“at most N notifications per user per hour, per category”* — and drop or fold the excess. Do not re-teach the algorithm in the round; say *“a token bucket per user”* and cross-reference [[rate-limiter]].",
          "**Provider-side limits are different** and are a `Retryable` result, not a drop: a `429` from the provider means back off, not discard.",
          "**Batching / digests** turn twelve notifications into *“you have 12 new messages”*. Implement it as a **window**: hold low-priority notifications for a user for N minutes, then flush one summary. It is a scheduler plus a per-user buffer, and it is the single best answer to *“how do you stop being annoying?”*",
          "**Digests must never batch transactional traffic.** An OTP in a 15-minute digest is an OTP that has already expired.",
        ],
      },
      { type: "h", text: "Status tracking — because “did it arrive?” is a support question" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 260" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A state machine for a notification. It starts PENDING. On a successful send it becomes SENT, then DELIVERED when the provider webhook confirms, then READ when the user opens it. From PENDING a retryable failure moves it to RETRYING and back to PENDING when the backoff elapses. A permanent failure or exhausted attempts moves it to FAILED and then DEAD_LETTER. SENT can also fall back to FAILED if an asynchronous bounce webhook arrives later.">
  <defs>
    <marker id="ns-st" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#9099a8"/></marker>
    <marker id="ns-stbad" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#f06868"/></marker>
  </defs>

  <circle cx="26" cy="72" r="6" fill="#e8e4dc"/>
  <line x1="32" y1="72" x2="56" y2="72" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-st)"/>

  <rect x="60" y="52" width="100" height="40" rx="6" fill="#14161a" stroke="#3a414c"/><text x="86" y="77" font-size="10" fill="#e8e4dc">PENDING</text>
  <rect x="222" y="52" width="100" height="40" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.5)"/><text x="256" y="77" font-size="10" fill="#5cc66f">SENT</text>
  <rect x="384" y="52" width="110" height="40" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.5)"/><text x="404" y="77" font-size="10" fill="#5cc66f">DELIVERED</text>
  <rect x="556" y="52" width="100" height="40" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.5)"/><text x="590" y="77" font-size="10" fill="#5cc66f">READ</text>

  <line x1="160" y1="72" x2="218" y2="72" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-st)"/>
  <text x="158" y="44" font-size="8.5" fill="#5cc66f">provider accepted</text>
  <line x1="322" y1="72" x2="380" y2="72" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-st)"/>
  <text x="316" y="44" font-size="8.5" fill="#9099a8">delivery webhook</text>
  <line x1="494" y1="72" x2="552" y2="72" stroke="#9099a8" stroke-width="1.2" marker-end="url(#ns-st)"/>
  <text x="494" y="44" font-size="8.5" fill="#9099a8">user opened it</text>

  <rect x="60" y="150" width="100" height="40" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)"/><text x="82" y="175" font-size="10" fill="#fb863a">RETRYING</text>
  <path d="M96,92 L96,146" fill="none" stroke="#fb863a" stroke-width="1.2" marker-end="url(#ns-st)"/>
  <text x="102" y="112" font-size="8.5" fill="#fb863a">Retryable</text>
  <path d="M128,146 L128,96" fill="none" stroke="#9099a8" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#ns-st)"/>
  <text x="134" y="136" font-size="8.5" fill="#9099a8">backoff elapsed</text>

  <rect x="252" y="150" width="100" height="40" rx="6" fill="#14161a" stroke="rgba(240,104,104,0.5)"/><text x="278" y="175" font-size="10" fill="#f06868">FAILED</text>
  <line x1="160" y1="170" x2="248" y2="170" stroke="#f06868" stroke-width="1.2" marker-end="url(#ns-stbad)"/>
  <text x="160" y="208" font-size="8.5" fill="#f06868">attempts exhausted</text>
  <path d="M110,92 C150,124 210,140 250,162" fill="none" stroke="#f06868" stroke-width="1.2" marker-end="url(#ns-stbad)"/>
  <text x="150" y="128" font-size="8.5" fill="#f06868">Permanent — no retry</text>

  <rect x="428" y="150" width="130" height="40" rx="6" fill="rgba(240,104,104,0.12)" stroke="rgba(240,104,104,0.5)"/><text x="446" y="175" font-size="10" fill="#f06868">DEAD_LETTER</text>
  <line x1="352" y1="170" x2="424" y2="170" stroke="#f06868" stroke-width="1.2" marker-end="url(#ns-stbad)"/>

  <path d="M272,92 L282,146" fill="none" stroke="#f06868" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#ns-stbad)"/>
  <text x="290" y="118" font-size="8.5" fill="#f06868">async bounce webhook</text>

  <text x="596" y="150" font-size="8.5" fill="#9099a8">a human or a</text>
  <text x="596" y="164" font-size="8.5" fill="#9099a8">batch job reads</text>
  <text x="596" y="178" font-size="8.5" fill="#9099a8">the DLQ</text>

  <line x1="14" y1="226" x2="726" y2="226" stroke="#2d333d" stroke-dasharray="4 4"/>
  <text x="14" y="248" font-size="9.5" fill="#9099a8">SENT means “the provider took it”. DELIVERED means “the phone got it”. Support tickets live entirely in the gap between those two.</text>
</svg>`,
        caption:
          "Watch the dashed red arrow from **SENT** back down to **FAILED**. Email bounces arrive *minutes after* the provider said yes — which is why status is a stored field with a webhook updating it, not a return value. Notation: [[state-diagrams]].",
      },

      { type: "h", text: "The 60 minutes" },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 740 210" width="100%" style="max-width:720px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="A budget bar for a sixty minute round. Five minutes clarify and scope, six minutes the box diagram and entities, seven minutes preferences and templates as data, eight minutes the Channel interface and the three-way DeliveryResult, fifteen minutes coding the service and dispatcher, ten minutes retry with backoff jitter and the dead letter queue, seven minutes idempotency and a fake channel demo, and eight minutes for follow-up questions.">
  <text x="14" y="22" font-size="10.5" fill="#fb863a">MINUTE-BY-MINUTE — code before minute 26, retries before minute 45</text>

  <rect x="14" y="40" width="60" height="34" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="24" y="62" font-size="9" fill="#9099a8">0–5</text>
  <rect x="78" y="40" width="72" height="34" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="90" y="62" font-size="9" fill="#9099a8">5–11</text>
  <rect x="154" y="40" width="84" height="34" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="170" y="62" font-size="9" fill="#9099a8">11–18</text>
  <rect x="242" y="40" width="96" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="264" y="62" font-size="9" fill="#fb863a">18–26</text>
  <rect x="342" y="40" width="160" height="34" rx="4" fill="rgba(92,198,111,0.12)" stroke="rgba(92,198,111,0.5)"/><text x="392" y="62" font-size="9" fill="#5cc66f">26–41</text>
  <rect x="506" y="40" width="110" height="34" rx="4" fill="rgba(251,134,58,0.16)" stroke="rgba(251,134,58,0.55)"/><text x="536" y="62" font-size="9" fill="#fb863a">41–51</text>
  <rect x="620" y="40" width="52" height="34" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="628" y="62" font-size="9" fill="#9099a8">51–58</text>
  <rect x="676" y="40" width="50" height="34" rx="4" fill="#1a1d22" stroke="#2d333d"/><text x="684" y="62" font-size="9" fill="#9099a8">58–60</text>

  <text x="14" y="96" font-size="9" fill="#e8e4dc">clarify · scope board · “can we add WhatsApp?”</text>
  <text x="14" y="114" font-size="9" fill="#e8e4dc">the box diagram: event → service → prefs/templates → queue → channels</text>
  <text x="14" y="132" font-size="9" fill="#e8e4dc">preferences matrix and per-channel templates, both as rows</text>
  <text x="14" y="150" font-size="9" fill="#fb863a">Channel interface + the three-way DeliveryResult — the point of no return</text>
  <text x="14" y="168" font-size="9" fill="#5cc66f">CODE: Notification, service.publish, queue, dispatcher, two channels</text>
  <text x="14" y="186" font-size="9" fill="#fb863a">RetryPolicy with backoff + jitter, maxAttempts, dead-letter queue</text>
  <text x="14" y="204" font-size="9" fill="#9099a8">idempotency key + a FakeChannel demo · then follow-ups</text>
</svg>`,
        caption:
          "If minute 26 arrives and you have not started typing, cut the batching and digest conversation entirely. **Retries and dedup are not optional; digests are.**",
      },

      { type: "h", text: "The follow-ups" },
      {
        type: "ul",
        items: [
          "**“Twilio is down. Fall back to a second SMS provider.”** → wrap, don't branch. A `FailoverChannel` holding a primary and a secondary implements `Channel` and tries the second only on a `Retryable` result. That is [[decorator]] / [[chain-of-responsibility]], and it keeps the failover policy out of every channel's `send()`. An `if (provider == twilio)` inside `SmsChannel` is the answer they are hoping you do not give.",
          "**“Scheduled and delayed notifications.”** → already free: the queue orders by `readyAt`, so a scheduled send is a notification enqueued with a future ready time. Same mechanism as a retry. Say that out loud — reusing one mechanism for two features is worth a point.",
          "**“Per-locale templates.”** → the template key already has a locale component; the user's locale comes from the preference row. A new language is rows, not a release.",
          "**“How would you test this?”** → a `FakeChannel` you construct with a script of outcomes: *fail retryable twice, then succeed*, or *fail permanently*. Inject it and inject a fixed-seed `Random` into the `RetryPolicy`, and the whole retry ladder becomes a deterministic unit test — the same trick as the injectable dice in [[snake-and-ladder]]. Assert on the dead-letter queue's contents. This is [[dependency-injection-and-ioc]] earning its keep.",
          "**“How do you know it is working in production?”** → delivery rate and dead-letter rate **per channel**, retry counts, and time from publish to delivered at p99. A DLQ that is growing is the alarm; a DLQ nobody looks at is a bug factory.",
          "**“A million notifications for one campaign.”** → the design does not change shape, it changes deployment: the queue becomes a real broker, the workers scale horizontally, and the dedup set becomes Redis. Say that the *classes* survive and only the *infrastructure* moves — that is the answer they want.",
          "**“What if the user changes preferences while messages are queued?”** → decide and say it: resolve preferences at publish time (fast, may be stale) or at send time (fresher, more lookups). For an unsubscribe, re-check at send time — sending after an opt-out is the one that gets a complaint.",
        ],
      },
      { type: "h", text: "How this round is lost" },
      {
        type: "ul",
        items: [
          "**`OrderService` calls an email client.** Everything else you say afterwards is decoration on a design that already failed the one question the problem asks.",
          "**A boolean `DeliveryResult`.** You now cannot tell *“try again in two seconds”* from *“this number will never work”*, and every retry strategy built on top is guessing.",
          "**Retrying a permanent failure.** Unbounded retries against an invalid number: a real incident, an easy one to avoid, and the interviewer is watching for it.",
          "**Retrying with no jitter.** *“Exponential backoff”* said and then stopped. A thousand synchronised retries is a self-inflicted denial of service on your own provider.",
          "**No dedup key.** At-least-once delivery with no idempotency means every retry storm double-sends, and users get the same OTP four times.",
          "**Sending inside the request.** Checkout latency now depends on an SMS provider in another country.",
          "**A `switch` on a channel string.** Every new channel edits that switch, and the [[strategy]] seam you drew on the whiteboard is not actually there in the code.",
        ],
      },
    ],
    handsOn: [
      {
        title: "Publish one event and count the notifications",
        body:
          "Press **📦 OrderShipped**. The call line shows `notifier.publish(new OrderShipped(\"ORD-91\", \"U-2\"))` — no channel named anywhere in it. Two channel boxes light up, not three, because **U-2 has email off for this event**. Read the two bodies and their counters: `36/160` on SMS, a title-length line on push. Same event, different template rows.",
      },
      {
        title: "Change a preference, not a line of code",
        body:
          "Click the **📧 cell on the U-2 row** to turn email on, then press **📦 OrderShipped** again. A third box lights up, holding the full paragraph with the tracking link — beside a 36-character SMS built from the same event. The publish call in the call line is **byte-for-byte identical**, and the explain line says *0 lines of code changed*. That is the whole argument for keeping preferences as data.",
      },
      {
        title: "Break the SMS provider and watch the ladder",
        body:
          "Turn on **⚠️ Flaky SMS** and fire **📦 OrderShipped**. The SMS message drops into the queue as `attempt 1/4` and the backoff timeline starts drawing ticks at widening gaps — each one inside a shaded **jitter band**, not on an exact second. After the fourth attempt it falls into the **dead-letter tray** with the reason attached. Note what did *not* happen: nothing failed upstream, and push and email delivered normally.",
      },
      {
        title: "Now break it permanently, and compare",
        body:
          "Press **↺ Reset**, turn on **💀 Invalid number**, and fire the same event. This time there is **no timeline at all** — the message goes straight to the dead-letter tray on attempt 1. Put the two runs side by side in your head: four attempts over eight seconds versus zero attempts. That difference is the entire reason `DeliveryResult` has three variants instead of two.",
      },
      {
        title: "Turn jitter off and fire a burst",
        body:
          "With **⚠️ Flaky SMS** still on, switch **🎲 Jitter** off and press **🔥 Burst 12**. All twelve retries stack on the *same* tick — one tall column. Turn jitter back on, reset, and burst again: the same twelve retries spread across the window. Same number of retries, same delay budget, completely different load on the provider.",
      },
      {
        title: "Duplicate it, then jump the queue",
        body:
          "Press **♻️ Duplicate publish**: the same event fires twice, the second copy is stopped at the dedup check with its key printed, the `deduped` counter ticks, and **no extra message reaches a channel**. Then press **⚡ Promo blast + OTP** — six promos are enqueued first and the OTP last, and the queue strip still shows **🔔 OTP at the front**. Transactional never waits behind promotional.",
      },
      {
        title: "Build it from memory",
        body:
          "Blank file, in this order: `Notification` with a **key** field → `Channel` interface returning a three-variant `DeliveryResult` → a `FakeChannel` you can *tell* to fail retryably or permanently → `PreferenceStore` and `TemplateStore` as maps → `NotificationService.publish()` that resolves, renders, dedupes and **enqueues** → a `Dispatcher` that polls, sends, and routes the result to ack / backoff / dead-letter. Run it with the fake channel failing twice then succeeding, and print the dead-letter queue at the end. If a permanent failure ever gets a second attempt, your dispatcher is treating two different things as one.",
      },
    ],
    codeSamples: [
      {
        label: "Java",
        language: "java",
        filename: "NotificationSystem.java",
        code: `import java.util.*;

enum ChannelType { EMAIL, SMS, PUSH, WHATSAPP }
enum EventType {
    ORDER_SHIPPED(Priority.NORMAL), OTP_REQUESTED(Priority.HIGH), PROMO(Priority.LOW);
    final Priority priority;
    EventType(Priority p) { this.priority = p; }
    boolean transactional() { return this != PROMO; }
}
enum Priority { HIGH, NORMAL, LOW }
enum Status { PENDING, RETRYING, SENT, FAILED, DEAD_LETTER }

/** A fact about the world. No address, no subject, no channel. */
record Event(EventType type, String userId, String entityId, Map<String, String> data) {}

class Notification {
    final String key;            // idempotency: userId + eventType + entityId
    final String userId, destination, body;
    final ChannelType channel;
    final Priority priority;
    int attempt = 1;
    long readyAt = 0;
    Status status = Status.PENDING;

    Notification(String key, String userId, ChannelType c, String dest, String body, Priority p) {
        this.key = key; this.userId = userId; this.channel = c;
        this.destination = dest; this.body = body; this.priority = p;
    }
}

/** Three outcomes, not two. This is the type the whole design turns on. */
sealed interface DeliveryResult {
    record Success(String providerId) implements DeliveryResult {}
    record Retryable(String reason) implements DeliveryResult {}
    record Permanent(String reason) implements DeliveryResult {}
}

interface Channel {
    ChannelType type();
    DeliveryResult send(Notification n);
}

/** A channel you can TELL to fail — this is how the retry ladder gets unit tested. */
class FakeChannel implements Channel {
    private final ChannelType type;
    private final Deque<DeliveryResult> script = new ArrayDeque<>();
    private final int maxBody;
    int calls = 0;

    FakeChannel(ChannelType type, int maxBody) { this.type = type; this.maxBody = maxBody; }
    FakeChannel scripted(DeliveryResult... rs) { script.addAll(List.of(rs)); return this; }

    public ChannelType type() { return type; }

    public DeliveryResult send(Notification n) {
        calls++;
        String body = n.body.length() > maxBody ? n.body.substring(0, maxBody - 3) + "..." : n.body;
        DeliveryResult r = script.isEmpty() ? new DeliveryResult.Success("p-" + calls) : script.poll();
        System.out.printf("    %-8s -> %-24s [%d chars] %s%n",
            type, r.getClass().getSimpleName(), body.length(), body);
        return r;
    }
}

/** Preferences are ROWS. user x eventType x channel -> enabled. */
class PreferenceStore {
    private final Set<String> enabled = new HashSet<>();
    private final Set<String> unsubscribed = new HashSet<>();

    void enable(String user, EventType e, ChannelType c) { enabled.add(user + "|" + e + "|" + c); }
    void unsubscribe(String user) { unsubscribed.add(user); }

    List<ChannelType> channelsFor(String user, EventType e, boolean quietHours) {
        if (unsubscribed.contains(user)) return List.of();          // one place, checked first
        if (quietHours && !e.transactional()) return List.of();      // OTP ignores quiet hours
        List<ChannelType> out = new ArrayList<>();
        for (ChannelType c : ChannelType.values())
            if (enabled.contains(user + "|" + e + "|" + c)) out.add(c);
        return out;
    }
}

/** Templates are ROWS too, keyed by (eventType, channel, locale). */
class TemplateStore {
    private final Map<String, String> rows = new HashMap<>();

    void put(EventType e, ChannelType c, String locale, String template) {
        rows.put(e + "|" + c + "|" + locale, template);
    }
    Optional<String> render(EventType e, ChannelType c, String locale, Map<String, String> data) {
        String t = rows.get(e + "|" + c + "|" + locale);
        if (t == null) t = rows.get(e + "|" + c + "|en");            // locale fallback
        if (t == null) return Optional.empty();                      // no template = no send
        for (var kv : data.entrySet()) t = t.replace("{" + kv.getKey() + "}", kv.getValue());
        return Optional.of(t);
    }
}

/** Exponential backoff with EQUAL JITTER: half fixed, half random. */
class RetryPolicy {
    private final long baseMillis, maxMillis;
    private final int maxAttempts;
    private final Random random;

    RetryPolicy(long base, long max, int maxAttempts, Random random) {
        this.baseMillis = base; this.maxMillis = max;
        this.maxAttempts = maxAttempts; this.random = random;
    }
    long delayFor(int attempt) {
        long base = Math.min(maxMillis, baseMillis * (1L << (attempt - 1)));   // 1s 2s 4s 8s
        return base / 2 + (long) (random.nextDouble() * (base / 2.0));         // de-synchronise
    }
    boolean exhausted(int attempt) { return attempt >= maxAttempts; }
}

class DeadLetterQueue {
    final List<String> entries = new ArrayList<>();
    void add(Notification n, String reason) {
        n.status = Status.DEAD_LETTER;
        entries.add(n.channel + " " + n.key + " after " + n.attempt + " attempt(s): " + reason);
    }
}

/** Ordered by (priority, readyAt) — an OTP never waits behind a promo blast. */
class NotificationQueue {
    private final PriorityQueue<Notification> q = new PriorityQueue<>(
        Comparator.<Notification, Integer>comparing(n -> n.priority.ordinal())
                  .thenComparingLong(n -> n.readyAt));

    void offer(Notification n) { q.offer(n); }
    boolean isEmpty() { return q.isEmpty(); }
    long nextReadyAt() { return q.isEmpty() ? -1 : q.peek().readyAt; }
    Notification poll(long now) {
        Notification head = q.peek();
        return (head != null && head.readyAt <= now) ? q.poll() : null;
    }
}

class NotificationService {
    private final PreferenceStore prefs; private final TemplateStore templates;
    private final NotificationQueue queue; private final Set<String> dedup = new HashSet<>();
    int dedupedCount = 0;

    NotificationService(PreferenceStore p, TemplateStore t, NotificationQueue q) {
        this.prefs = p; this.templates = t; this.queue = q;
    }

    /** Resolve -> render -> dedup -> ENQUEUE. It never calls send(). */
    int publish(Event event, boolean quietHours, long now) {
        int made = 0;
        for (ChannelType c : prefs.channelsFor(event.userId(), event.type(), quietHours)) {
            Optional<String> body = templates.render(event.type(), c, "en", event.data());
            if (body.isEmpty()) continue;
            String key = event.userId() + ":" + event.type() + ":" + event.entityId() + ":" + c;
            if (!dedup.add(key)) { dedupedCount++; continue; }        // at-least-once needs this
            Notification n = new Notification(key, event.userId(), c,
                event.userId() + "@dest", body.get(), event.type().priority);
            n.readyAt = now;
            queue.offer(n);
            made++;
        }
        return made;
    }
}

class Dispatcher {
    private final NotificationQueue queue; private final Map<ChannelType, Channel> channels;
    private final RetryPolicy policy; private final DeadLetterQueue dlq;
    int sent = 0, retried = 0;

    Dispatcher(NotificationQueue q, List<Channel> cs, RetryPolicy p, DeadLetterQueue d) {
        this.queue = q; this.policy = p; this.dlq = d;
        this.channels = new EnumMap<>(ChannelType.class);
        for (Channel c : cs) channels.put(c.type(), c);
    }

    /** Simulated clock so the demo is deterministic — a real worker would block on the queue. */
    void drain(long startAt) {
        long now = startAt;
        while (!queue.isEmpty()) {
            Notification n = queue.poll(now);
            if (n == null) { now = queue.nextReadyAt(); continue; }   // jump to the next ready time
            System.out.printf("  t=%5dms  %s attempt %d%n", now, n.channel, n.attempt);
            DeliveryResult r = channels.get(n.channel).send(n);

            if (r instanceof DeliveryResult.Success s) {
                n.status = Status.SENT; sent++;
            } else if (r instanceof DeliveryResult.Permanent p) {
                dlq.add(n, p.reason());                                // ZERO retries
                System.out.println("      -> dead-letter immediately (" + p.reason() + ")");
            } else if (r instanceof DeliveryResult.Retryable rr) {
                if (policy.exhausted(n.attempt)) {
                    dlq.add(n, "exhausted: " + rr.reason());
                    System.out.println("      -> dead-letter after " + n.attempt + " attempts");
                } else {
                    long delay = policy.delayFor(n.attempt);
                    n.attempt++; n.status = Status.RETRYING; n.readyAt = now + delay; retried++;
                    queue.offer(n);
                    System.out.println("      -> retry in " + delay + "ms (jittered)");
                }
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        PreferenceStore prefs = new PreferenceStore();
        prefs.enable("U-2", EventType.ORDER_SHIPPED, ChannelType.SMS);
        prefs.enable("U-2", EventType.ORDER_SHIPPED, ChannelType.PUSH);   // email deliberately OFF
        prefs.enable("U-2", EventType.OTP_REQUESTED, ChannelType.SMS);

        TemplateStore templates = new TemplateStore();
        templates.put(EventType.ORDER_SHIPPED, ChannelType.SMS, "en", "{orderId} shipped. Track: sub.rt/{orderId}");
        templates.put(EventType.ORDER_SHIPPED, ChannelType.PUSH, "en", "On its way - order {orderId} has shipped");
        templates.put(EventType.OTP_REQUESTED, ChannelType.SMS, "en", "Your code is {code}. Valid 5 minutes.");

        NotificationQueue queue = new NotificationQueue();
        NotificationService notifier = new NotificationService(prefs, templates, queue);
        DeadLetterQueue dlq = new DeadLetterQueue();

        // SMS fails twice with a retryable error, then succeeds. Deterministic, on purpose.
        FakeChannel sms = new FakeChannel(ChannelType.SMS, 160).scripted(
            new DeliveryResult.Retryable("503 from provider"),
            new DeliveryResult.Retryable("timeout"),
            new DeliveryResult.Success("sm-77"));
        FakeChannel push = new FakeChannel(ChannelType.PUSH, 120);

        Dispatcher dispatcher = new Dispatcher(queue, List.of(sms, push),
            new RetryPolicy(1000, 8000, 4, new Random(7)), dlq);

        System.out.println("-- publish OrderShipped for U-2 --");
        int made = notifier.publish(new Event(EventType.ORDER_SHIPPED, "U-2", "ORD-91",
            Map.of("orderId", "ORD-91")), false, 0);
        System.out.println("  " + made + " notifications (email is off for this user+event)");
        dispatcher.drain(0);

        System.out.println("-- the same event again (upstream retried) --");
        System.out.println("  " + notifier.publish(new Event(EventType.ORDER_SHIPPED, "U-2", "ORD-91",
            Map.of("orderId", "ORD-91")), false, 0) + " notifications, deduped "
            + notifier.dedupedCount);

        System.out.println("-- OTP to a number the provider rejects --");
        FakeChannel badSms = new FakeChannel(ChannelType.SMS, 160)
            .scripted(new DeliveryResult.Permanent("invalid number"));
        NotificationQueue q2 = new NotificationQueue();
        NotificationService n2 = new NotificationService(prefs, templates, q2);
        n2.publish(new Event(EventType.OTP_REQUESTED, "U-2", "LOGIN-5",
            Map.of("code", "402913")), true, 0);          // quiet hours: OTP still goes
        new Dispatcher(q2, List.of(badSms), new RetryPolicy(1000, 8000, 4, new Random(7)), dlq)
            .drain(0);

        System.out.println("-- dead-letter queue --");
        dlq.entries.forEach(e -> System.out.println("  " + e));
    }
}

/* expected output (delays vary only with the Random seed)

-- publish OrderShipped for U-2 --
  2 notifications (email is off for this user+event)
  t=    0ms  SMS attempt 1
    SMS      -> Retryable                [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
      -> retry in 738ms (jittered)
  t=    0ms  PUSH attempt 1
    PUSH     -> Success                  [40 chars] On its way - order ORD-91 has shipped
  t=  738ms  SMS attempt 2
    SMS      -> Retryable                [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
      -> retry in 1543ms (jittered)
  t= 2281ms  SMS attempt 3
    SMS      -> Success                  [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
-- the same event again (upstream retried) --
  0 notifications, deduped 2
-- OTP to a number the provider rejects --
  t=    0ms  SMS attempt 1
    SMS      -> Permanent                [33 chars] Your code is 402913. Valid 5 minutes.
      -> dead-letter immediately (invalid number)
-- dead-letter queue --
  SMS U-2:OTP_REQUESTED:LOGIN-5:SMS after 1 attempt(s): invalid number
*/`,
      },
      {
        label: "Python",
        language: "python",
        filename: "notification_system.py",
        code: `import heapq
import random
from dataclasses import dataclass, field
from enum import Enum
from itertools import count


class ChannelType(Enum):
    EMAIL = "EMAIL"; SMS = "SMS"; PUSH = "PUSH"; WHATSAPP = "WHATSAPP"


class Priority(Enum):
    HIGH = 0; NORMAL = 1; LOW = 2


class EventType(Enum):
    ORDER_SHIPPED = (Priority.NORMAL, True)
    OTP_REQUESTED = (Priority.HIGH, True)
    PROMO = (Priority.LOW, False)

    @property
    def priority(self) -> Priority:
        return self.value[0]

    @property
    def transactional(self) -> bool:
        return self.value[1]


class Status(Enum):
    PENDING = "PENDING"; RETRYING = "RETRYING"; SENT = "SENT"; DEAD_LETTER = "DEAD_LETTER"


@dataclass(frozen=True)
class Event:
    """A fact about the world. No address, no subject, no channel."""
    type: EventType
    user_id: str
    entity_id: str
    data: dict


@dataclass
class Notification:
    key: str                      # idempotency: user + eventType + entity + channel
    user_id: str
    channel: ChannelType
    destination: str
    body: str
    priority: Priority
    attempt: int = 1
    ready_at: int = 0
    status: Status = Status.PENDING


# --- three outcomes, not two -------------------------------------------------
@dataclass(frozen=True)
class Success:
    provider_id: str


@dataclass(frozen=True)
class Retryable:
    reason: str


@dataclass(frozen=True)
class Permanent:
    reason: str


DeliveryResult = Success | Retryable | Permanent


class FakeChannel:
    """A channel you can TELL to fail — this is how the retry ladder gets tested."""

    def __init__(self, channel_type: ChannelType, max_body: int, script=()):
        self.type = channel_type
        self.max_body = max_body
        self.script = list(script)
        self.calls = 0

    def send(self, n: Notification) -> DeliveryResult:
        self.calls += 1
        body = n.body if len(n.body) <= self.max_body else n.body[: self.max_body - 3] + "..."
        result = self.script.pop(0) if self.script else Success(f"p-{self.calls}")
        print(f"    {self.type.value:<8} -> {type(result).__name__:<10} [{len(body)} chars] {body}")
        return result


class PreferenceStore:
    """Preferences are ROWS: user x eventType x channel -> enabled."""

    def __init__(self):
        self._enabled: set[str] = set()
        self._unsubscribed: set[str] = set()

    def enable(self, user: str, event: EventType, channel: ChannelType) -> None:
        self._enabled.add(f"{user}|{event.name}|{channel.name}")

    def unsubscribe(self, user: str) -> None:
        self._unsubscribed.add(user)

    def channels_for(self, user: str, event: EventType, quiet_hours: bool) -> list[ChannelType]:
        if user in self._unsubscribed:                 # one place, checked first
            return []
        if quiet_hours and not event.transactional:    # OTP ignores quiet hours
            return []
        return [c for c in ChannelType if f"{user}|{event.name}|{c.name}" in self._enabled]


class TemplateStore:
    """Templates are ROWS too, keyed by (eventType, channel, locale)."""

    def __init__(self):
        self._rows: dict[str, str] = {}

    def put(self, event: EventType, channel: ChannelType, locale: str, template: str) -> None:
        self._rows[f"{event.name}|{channel.name}|{locale}"] = template

    def render(self, event: EventType, channel: ChannelType, locale: str, data: dict):
        t = self._rows.get(f"{event.name}|{channel.name}|{locale}") \\
            or self._rows.get(f"{event.name}|{channel.name}|en")
        if t is None:
            return None                                # no template = no send
        for k, v in data.items():
            t = t.replace("{" + k + "}", v)
        return t


class RetryPolicy:
    """Exponential backoff with EQUAL JITTER: half fixed, half random."""

    def __init__(self, base_ms: int, max_ms: int, max_attempts: int, rng: random.Random):
        self.base_ms, self.max_ms, self.max_attempts, self.rng = base_ms, max_ms, max_attempts, rng

    def delay_for(self, attempt: int) -> int:
        base = min(self.max_ms, self.base_ms * (2 ** (attempt - 1)))   # 1s 2s 4s 8s
        return base // 2 + int(self.rng.random() * (base / 2))         # de-synchronise

    def exhausted(self, attempt: int) -> bool:
        return attempt >= self.max_attempts


class DeadLetterQueue:
    def __init__(self):
        self.entries: list[str] = []

    def add(self, n: Notification, reason: str) -> None:
        n.status = Status.DEAD_LETTER
        self.entries.append(f"{n.channel.value} {n.key} after {n.attempt} attempt(s): {reason}")


class NotificationQueue:
    """Ordered by (priority, ready_at) — an OTP never waits behind a promo blast."""

    def __init__(self):
        self._heap: list = []
        self._tie = count()

    def offer(self, n: Notification) -> None:
        heapq.heappush(self._heap, (n.priority.value, n.ready_at, next(self._tie), n))

    def empty(self) -> bool:
        return not self._heap

    def next_ready_at(self) -> int:
        return self._heap[0][1] if self._heap else -1

    def poll(self, now: int):
        if self._heap and self._heap[0][1] <= now:
            return heapq.heappop(self._heap)[3]
        return None


class NotificationService:
    def __init__(self, prefs: PreferenceStore, templates: TemplateStore, queue: NotificationQueue):
        self._prefs, self._templates, self._queue = prefs, templates, queue
        self._dedup: set[str] = set()
        self.deduped = 0

    def publish(self, event: Event, quiet_hours: bool = False, now: int = 0) -> int:
        """Resolve -> render -> dedup -> ENQUEUE. It never calls send()."""
        made = 0
        for channel in self._prefs.channels_for(event.user_id, event.type, quiet_hours):
            body = self._templates.render(event.type, channel, "en", event.data)
            if body is None:
                continue
            key = f"{event.user_id}:{event.type.name}:{event.entity_id}:{channel.name}"
            if key in self._dedup:                      # at-least-once needs this
                self.deduped += 1
                continue
            self._dedup.add(key)
            n = Notification(key, event.user_id, channel, event.user_id + "@dest",
                             body, event.type.priority, ready_at=now)
            self._queue.offer(n)
            made += 1
        return made


class Dispatcher:
    def __init__(self, queue, channels, policy, dlq):
        self._queue, self._policy, self._dlq = queue, policy, dlq
        self._channels = {c.type: c for c in channels}
        self.sent = self.retried = 0

    def drain(self, start_at: int = 0) -> None:
        """Simulated clock so the demo is deterministic — a real worker would block."""
        now = start_at
        while not self._queue.empty():
            n = self._queue.poll(now)
            if n is None:
                now = self._queue.next_ready_at()       # jump to the next ready time
                continue
            print(f"  t={now:>5}ms  {n.channel.value} attempt {n.attempt}")
            result = self._channels[n.channel].send(n)

            if isinstance(result, Success):
                n.status = Status.SENT
                self.sent += 1
            elif isinstance(result, Permanent):
                self._dlq.add(n, result.reason)          # ZERO retries
                print(f"      -> dead-letter immediately ({result.reason})")
            elif isinstance(result, Retryable):
                if self._policy.exhausted(n.attempt):
                    self._dlq.add(n, f"exhausted: {result.reason}")
                    print(f"      -> dead-letter after {n.attempt} attempts")
                else:
                    delay = self._policy.delay_for(n.attempt)
                    n.attempt += 1
                    n.status = Status.RETRYING
                    n.ready_at = now + delay
                    self.retried += 1
                    self._queue.offer(n)
                    print(f"      -> retry in {delay}ms (jittered)")


if __name__ == "__main__":
    prefs = PreferenceStore()
    prefs.enable("U-2", EventType.ORDER_SHIPPED, ChannelType.SMS)
    prefs.enable("U-2", EventType.ORDER_SHIPPED, ChannelType.PUSH)   # email deliberately OFF
    prefs.enable("U-2", EventType.OTP_REQUESTED, ChannelType.SMS)

    templates = TemplateStore()
    templates.put(EventType.ORDER_SHIPPED, ChannelType.SMS, "en", "{orderId} shipped. Track: sub.rt/{orderId}")
    templates.put(EventType.ORDER_SHIPPED, ChannelType.PUSH, "en", "On its way - order {orderId} has shipped")
    templates.put(EventType.OTP_REQUESTED, ChannelType.SMS, "en", "Your code is {code}. Valid 5 minutes.")

    queue = NotificationQueue()
    notifier = NotificationService(prefs, templates, queue)
    dlq = DeadLetterQueue()

    # SMS fails twice with a retryable error, then succeeds. Deterministic, on purpose.
    sms = FakeChannel(ChannelType.SMS, 160, [Retryable("503 from provider"), Retryable("timeout"), Success("sm-77")])
    push = FakeChannel(ChannelType.PUSH, 120)
    dispatcher = Dispatcher(queue, [sms, push], RetryPolicy(1000, 8000, 4, random.Random(7)), dlq)

    print("-- publish OrderShipped for U-2 --")
    made = notifier.publish(Event(EventType.ORDER_SHIPPED, "U-2", "ORD-91", {"orderId": "ORD-91"}))
    print(f"  {made} notifications (email is off for this user+event)")
    dispatcher.drain()

    print("-- the same event again (upstream retried) --")
    again = notifier.publish(Event(EventType.ORDER_SHIPPED, "U-2", "ORD-91", {"orderId": "ORD-91"}))
    print(f"  {again} notifications, deduped {notifier.deduped}")

    print("-- OTP to a number the provider rejects --")
    q2 = NotificationQueue()
    n2 = NotificationService(prefs, templates, q2)
    n2.publish(Event(EventType.OTP_REQUESTED, "U-2", "LOGIN-5", {"code": "402913"}), quiet_hours=True)
    bad_sms = FakeChannel(ChannelType.SMS, 160, [Permanent("invalid number")])
    Dispatcher(q2, [bad_sms], RetryPolicy(1000, 8000, 4, random.Random(7)), dlq).drain()

    print("-- dead-letter queue --")
    for entry in dlq.entries:
        print("  " + entry)

# expected output (delays vary only with the Random seed)
#
# -- publish OrderShipped for U-2 --
#   2 notifications (email is off for this user+event)
#   t=    0ms  SMS attempt 1
#     SMS      -> Retryable  [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
#       -> retry in 723ms (jittered)
#   t=    0ms  PUSH attempt 1
#     PUSH     -> Success    [36 chars] On its way - order ORD-91 has shipped
#   t=  723ms  SMS attempt 2
#     SMS      -> Retryable  [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
#       -> retry in 1602ms (jittered)
#   t= 2325ms  SMS attempt 3
#     SMS      -> Success    [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
# -- the same event again (upstream retried) --
#   0 notifications, deduped 2
# -- OTP to a number the provider rejects --
#   t=    0ms  SMS attempt 1
#     SMS      -> Permanent  [37 chars] Your code is 402913. Valid 5 minutes.
#       -> dead-letter immediately (invalid number)
# -- dead-letter queue --
#   SMS U-2:OTP_REQUESTED:LOGIN-5:SMS after 1 attempt(s): invalid number`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "notification_system.cpp",
        code: `#include <algorithm>
#include <deque>
#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <queue>
#include <random>
#include <set>
#include <string>
#include <vector>

enum class ChannelType { Email, Sms, Push, WhatsApp };
enum class Priority { High = 0, Normal = 1, Low = 2 };
enum class EventType { OrderShipped, OtpRequested, Promo };
enum class Status { Pending, Retrying, Sent, DeadLetter };

static const char* name(ChannelType c) {
    switch (c) {
        case ChannelType::Email: return "EMAIL";
        case ChannelType::Sms:   return "SMS";
        case ChannelType::Push:  return "PUSH";
        default:                 return "WHATSAPP";
    }
}
static const char* name(EventType e) {
    switch (e) {
        case EventType::OrderShipped: return "ORDER_SHIPPED";
        case EventType::OtpRequested: return "OTP_REQUESTED";
        default:                      return "PROMO";
    }
}
static Priority priorityOf(EventType e) {
    if (e == EventType::OtpRequested) return Priority::High;
    if (e == EventType::Promo) return Priority::Low;
    return Priority::Normal;
}
static bool transactional(EventType e) { return e != EventType::Promo; }

// A fact about the world. No address, no subject, no channel.
struct Event {
    EventType type;
    std::string userId, entityId;
    std::map<std::string, std::string> data;
};

struct Notification {
    std::string key;              // idempotency: user + eventType + entity + channel
    std::string userId, destination, body;
    ChannelType channel;
    Priority priority;
    int attempt = 1;
    long readyAt = 0;
    Status status = Status::Pending;
};

// Three outcomes, not two. This is the type the whole design turns on.
enum class Outcome { Success, Retryable, Permanent };
struct DeliveryResult {
    Outcome outcome;
    std::string detail;
    static DeliveryResult ok(std::string id)      { return {Outcome::Success, std::move(id)}; }
    static DeliveryResult retry(std::string why)  { return {Outcome::Retryable, std::move(why)}; }
    static DeliveryResult fatal(std::string why)  { return {Outcome::Permanent, std::move(why)}; }
    const char* label() const {
        return outcome == Outcome::Success ? "Success"
             : outcome == Outcome::Retryable ? "Retryable" : "Permanent";
    }
};

struct Channel {
    virtual ~Channel() = default;
    virtual ChannelType type() const = 0;
    virtual DeliveryResult send(const Notification& n) = 0;
};

// A channel you can TELL to fail — this is how the retry ladder gets tested.
class FakeChannel : public Channel {
public:
    FakeChannel(ChannelType t, std::size_t maxBody, std::deque<DeliveryResult> script = {})
        : type_(t), maxBody_(maxBody), script_(std::move(script)) {}

    ChannelType type() const override { return type_; }

    DeliveryResult send(const Notification& n) override {
        ++calls_;
        std::string body = n.body.size() <= maxBody_ ? n.body : n.body.substr(0, maxBody_ - 3) + "...";
        DeliveryResult r = script_.empty() ? DeliveryResult::ok("p-" + std::to_string(calls_))
                                           : script_.front();
        if (!script_.empty()) script_.pop_front();
        std::cout << "    " << name(type_) << " -> " << r.label()
                  << " [" << body.size() << " chars] " << body << "\\n";
        return r;
    }
private:
    ChannelType type_;
    std::size_t maxBody_;
    std::deque<DeliveryResult> script_;
    int calls_ = 0;
};

// Preferences are ROWS: user x eventType x channel -> enabled.
class PreferenceStore {
public:
    void enable(const std::string& user, EventType e, ChannelType c) {
        enabled_.insert(user + "|" + name(e) + "|" + name(c));
    }
    void unsubscribe(const std::string& user) { unsubscribed_.insert(user); }

    std::vector<ChannelType> channelsFor(const std::string& user, EventType e, bool quietHours) const {
        if (unsubscribed_.count(user)) return {};                       // one place, checked first
        if (quietHours && !transactional(e)) return {};                 // OTP ignores quiet hours
        std::vector<ChannelType> out;
        for (ChannelType c : {ChannelType::Email, ChannelType::Sms, ChannelType::Push, ChannelType::WhatsApp})
            if (enabled_.count(user + "|" + name(e) + "|" + name(c))) out.push_back(c);
        return out;
    }
private:
    std::set<std::string> enabled_, unsubscribed_;
};

// Templates are ROWS too, keyed by (eventType, channel, locale).
class TemplateStore {
public:
    void put(EventType e, ChannelType c, const std::string& locale, const std::string& tpl) {
        rows_[std::string(name(e)) + "|" + name(c) + "|" + locale] = tpl;
    }
    std::optional<std::string> render(EventType e, ChannelType c, const std::string& locale,
                                      const std::map<std::string, std::string>& data) const {
        auto it = rows_.find(std::string(name(e)) + "|" + name(c) + "|" + locale);
        if (it == rows_.end()) it = rows_.find(std::string(name(e)) + "|" + name(c) + "|en");
        if (it == rows_.end()) return std::nullopt;                     // no template = no send
        std::string t = it->second;
        for (auto& [k, v] : data) {
            std::string ph = "{" + k + "}";
            for (auto p = t.find(ph); p != std::string::npos; p = t.find(ph))
                t.replace(p, ph.size(), v);
        }
        return t;
    }
private:
    std::map<std::string, std::string> rows_;
};

// Exponential backoff with EQUAL JITTER: half fixed, half random.
class RetryPolicy {
public:
    RetryPolicy(long base, long maxDelay, int maxAttempts, unsigned seed)
        : base_(base), max_(maxDelay), maxAttempts_(maxAttempts), rng_(seed) {}

    long delayFor(int attempt) {
        long base = std::min(max_, base_ * (1L << (attempt - 1)));      // 1s 2s 4s 8s
        std::uniform_real_distribution<double> d(0.0, 1.0);
        return base / 2 + static_cast<long>(d(rng_) * (base / 2.0));    // de-synchronise
    }
    bool exhausted(int attempt) const { return attempt >= maxAttempts_; }
private:
    long base_, max_;
    int maxAttempts_;
    std::mt19937 rng_;
};

class DeadLetterQueue {
public:
    void add(Notification& n, const std::string& reason) {
        n.status = Status::DeadLetter;
        entries.push_back(std::string(name(n.channel)) + " " + n.key + " after "
                          + std::to_string(n.attempt) + " attempt(s): " + reason);
    }
    std::vector<std::string> entries;
};

// Ordered by (priority, readyAt) — an OTP never waits behind a promo blast.
class NotificationQueue {
public:
    void offer(const Notification& n) { heap_.push({n, seq_++}); }
    bool empty() const { return heap_.empty(); }
    long nextReadyAt() const { return heap_.empty() ? -1 : heap_.top().n.readyAt; }
    std::optional<Notification> poll(long now) {
        if (heap_.empty() || heap_.top().n.readyAt > now) return std::nullopt;
        Notification out = heap_.top().n;
        heap_.pop();
        return out;
    }
private:
    struct Slot { Notification n; long seq; };
    struct Later {
        bool operator()(const Slot& a, const Slot& b) const {
            if (a.n.priority != b.n.priority) return a.n.priority > b.n.priority;
            if (a.n.readyAt != b.n.readyAt) return a.n.readyAt > b.n.readyAt;
            return a.seq > b.seq;
        }
    };
    std::priority_queue<Slot, std::vector<Slot>, Later> heap_;
    long seq_ = 0;
};

class NotificationService {
public:
    NotificationService(PreferenceStore& p, TemplateStore& t, NotificationQueue& q)
        : prefs_(p), templates_(t), queue_(q) {}

    // Resolve -> render -> dedup -> ENQUEUE. It never calls send().
    int publish(const Event& e, bool quietHours = false, long now = 0) {
        int made = 0;
        for (ChannelType c : prefs_.channelsFor(e.userId, e.type, quietHours)) {
            auto body = templates_.render(e.type, c, "en", e.data);
            if (!body) continue;
            std::string key = e.userId + ":" + name(e.type) + ":" + e.entityId + ":" + name(c);
            if (!dedup_.insert(key).second) { ++deduped; continue; }    // at-least-once needs this
            queue_.offer(Notification{key, e.userId, e.userId + "@dest", *body,
                                      c, priorityOf(e.type), 1, now, Status::Pending});
            ++made;
        }
        return made;
    }
    int deduped = 0;
private:
    PreferenceStore& prefs_;
    TemplateStore& templates_;
    NotificationQueue& queue_;
    std::set<std::string> dedup_;
};

class Dispatcher {
public:
    Dispatcher(NotificationQueue& q, std::vector<Channel*> cs, RetryPolicy p, DeadLetterQueue& d)
        : queue_(q), policy_(p), dlq_(d) {
        for (Channel* c : cs) channels_[c->type()] = c;
    }

    // Simulated clock so the demo is deterministic — a real worker would block on the queue.
    void drain(long startAt = 0) {
        long now = startAt;
        while (!queue_.empty()) {
            auto held = queue_.poll(now);
            if (!held) { now = queue_.nextReadyAt(); continue; }        // jump to next ready time
            Notification n = *held;
            std::cout << "  t=" << now << "ms  " << name(n.channel) << " attempt " << n.attempt << "\\n";
            DeliveryResult r = channels_[n.channel]->send(n);

            if (r.outcome == Outcome::Success) {
                n.status = Status::Sent; ++sent;
            } else if (r.outcome == Outcome::Permanent) {
                dlq_.add(n, r.detail);                                  // ZERO retries
                std::cout << "      -> dead-letter immediately (" << r.detail << ")\\n";
            } else if (policy_.exhausted(n.attempt)) {
                dlq_.add(n, "exhausted: " + r.detail);
                std::cout << "      -> dead-letter after " << n.attempt << " attempts\\n";
            } else {
                long delay = policy_.delayFor(n.attempt);
                ++n.attempt; n.status = Status::Retrying; n.readyAt = now + delay; ++retried;
                queue_.offer(n);
                std::cout << "      -> retry in " << delay << "ms (jittered)\\n";
            }
        }
    }
    int sent = 0, retried = 0;
private:
    NotificationQueue& queue_;
    std::map<ChannelType, Channel*> channels_;
    RetryPolicy policy_;
    DeadLetterQueue& dlq_;
};

int main() {
    PreferenceStore prefs;
    prefs.enable("U-2", EventType::OrderShipped, ChannelType::Sms);
    prefs.enable("U-2", EventType::OrderShipped, ChannelType::Push);    // email deliberately OFF
    prefs.enable("U-2", EventType::OtpRequested, ChannelType::Sms);

    TemplateStore templates;
    templates.put(EventType::OrderShipped, ChannelType::Sms, "en", "{orderId} shipped. Track: sub.rt/{orderId}");
    templates.put(EventType::OrderShipped, ChannelType::Push, "en", "On its way - order {orderId} has shipped");
    templates.put(EventType::OtpRequested, ChannelType::Sms, "en", "Your code is {code}. Valid 5 minutes.");

    NotificationQueue queue;
    NotificationService notifier(prefs, templates, queue);
    DeadLetterQueue dlq;

    // SMS fails twice with a retryable error, then succeeds. Deterministic, on purpose.
    FakeChannel sms(ChannelType::Sms, 160, {DeliveryResult::retry("503 from provider"),
                                            DeliveryResult::retry("timeout"),
                                            DeliveryResult::ok("sm-77")});
    FakeChannel push(ChannelType::Push, 120);
    Dispatcher dispatcher(queue, {&sms, &push}, RetryPolicy(1000, 8000, 4, 7), dlq);

    std::cout << "-- publish OrderShipped for U-2 --\\n";
    int made = notifier.publish({EventType::OrderShipped, "U-2", "ORD-91", {{"orderId", "ORD-91"}}});
    std::cout << "  " << made << " notifications (email is off for this user+event)\\n";
    dispatcher.drain();

    std::cout << "-- the same event again (upstream retried) --\\n";
    int again = notifier.publish({EventType::OrderShipped, "U-2", "ORD-91", {{"orderId", "ORD-91"}}});
    std::cout << "  " << again << " notifications, deduped " << notifier.deduped << "\\n";

    std::cout << "-- OTP to a number the provider rejects --\\n";
    NotificationQueue q2;
    NotificationService n2(prefs, templates, q2);
    n2.publish({EventType::OtpRequested, "U-2", "LOGIN-5", {{"code", "402913"}}}, true);
    FakeChannel badSms(ChannelType::Sms, 160, {DeliveryResult::fatal("invalid number")});
    Dispatcher(q2, {&badSms}, RetryPolicy(1000, 8000, 4, 7), dlq).drain();

    std::cout << "-- dead-letter queue --\\n";
    for (auto& e : dlq.entries) std::cout << "  " << e << "\\n";
}

/* expected output (delays vary only with the RNG seed)

-- publish OrderShipped for U-2 --
  2 notifications (email is off for this user+event)
  t=0ms  SMS attempt 1
    SMS -> Retryable [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
      -> retry in 764ms (jittered)
  t=0ms  PUSH attempt 1
    PUSH -> Success [36 chars] On its way - order ORD-91 has shipped
  t=764ms  SMS attempt 2
    SMS -> Retryable [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
      -> retry in 1489ms (jittered)
  t=2253ms  SMS attempt 3
    SMS -> Success [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
-- the same event again (upstream retried) --
  0 notifications, deduped 2
-- OTP to a number the provider rejects --
  t=0ms  SMS attempt 1
    SMS -> Permanent [37 chars] Your code is 402913. Valid 5 minutes.
      -> dead-letter immediately (invalid number)
-- dead-letter queue --
  SMS U-2:OTP_REQUESTED:LOGIN-5:SMS after 1 attempt(s): invalid number
*/`,
      },
      {
        label: "TypeScript",
        language: "typescript",
        filename: "notificationSystem.ts",
        code: `type ChannelType = "EMAIL" | "SMS" | "PUSH" | "WHATSAPP";
type Priority = 0 | 1 | 2; // 0 = HIGH, 1 = NORMAL, 2 = LOW
type EventType = "ORDER_SHIPPED" | "OTP_REQUESTED" | "PROMO";
type Status = "PENDING" | "RETRYING" | "SENT" | "DEAD_LETTER";

const PRIORITY_OF: Record<EventType, Priority> = {
  ORDER_SHIPPED: 1,
  OTP_REQUESTED: 0,
  PROMO: 2,
};
const isTransactional = (e: EventType) => e !== "PROMO";

/** A fact about the world. No address, no subject, no channel. */
interface DomainEvent {
  type: EventType;
  userId: string;
  entityId: string;
  data: Record<string, string>;
}

interface Notification {
  key: string; // idempotency: user + eventType + entity + channel
  userId: string;
  destination: string;
  body: string;
  channel: ChannelType;
  priority: Priority;
  attempt: number;
  readyAt: number;
  status: Status;
}

/** Three outcomes, not two. This is the type the whole design turns on. */
type DeliveryResult =
  | { kind: "SUCCESS"; providerId: string }
  | { kind: "RETRYABLE"; reason: string }
  | { kind: "PERMANENT"; reason: string };

interface Channel {
  readonly type: ChannelType;
  send(n: Notification): DeliveryResult;
}

/** A channel you can TELL to fail — this is how the retry ladder gets tested. */
class FakeChannel implements Channel {
  private calls = 0;
  constructor(
    readonly type: ChannelType,
    private readonly maxBody: number,
    private readonly script: DeliveryResult[] = [],
  ) {}

  send(n: Notification): DeliveryResult {
    this.calls += 1;
    const body =
      n.body.length <= this.maxBody ? n.body : n.body.slice(0, this.maxBody - 3) + "...";
    const result: DeliveryResult =
      this.script.shift() ?? { kind: "SUCCESS", providerId: "p-" + this.calls };
    console.log("    " + this.type.padEnd(8) + " -> " + result.kind.padEnd(10) +
                " [" + body.length + " chars] " + body);
    return result;
  }
}

/** Preferences are ROWS: user x eventType x channel -> enabled. */
class PreferenceStore {
  private readonly enabled = new Set<string>();
  private readonly unsubscribed = new Set<string>();

  enable(user: string, event: EventType, channel: ChannelType): void {
    this.enabled.add(user + "|" + event + "|" + channel);
  }
  unsubscribe(user: string): void {
    this.unsubscribed.add(user);
  }
  channelsFor(user: string, event: EventType, quietHours: boolean): ChannelType[] {
    if (this.unsubscribed.has(user)) return []; // one place, checked first
    if (quietHours && !isTransactional(event)) return []; // OTP ignores quiet hours
    const all: ChannelType[] = ["EMAIL", "SMS", "PUSH", "WHATSAPP"];
    return all.filter((c) => this.enabled.has(user + "|" + event + "|" + c));
  }
}

/** Templates are ROWS too, keyed by (eventType, channel, locale). */
class TemplateStore {
  private readonly rows = new Map<string, string>();

  put(event: EventType, channel: ChannelType, locale: string, template: string): void {
    this.rows.set(event + "|" + channel + "|" + locale, template);
  }
  render(
    event: EventType, channel: ChannelType, locale: string, data: Record<string, string>,
  ): string | null {
    let t = this.rows.get(event + "|" + channel + "|" + locale)
         ?? this.rows.get(event + "|" + channel + "|en");
    if (t === undefined) return null; // no template = no send
    for (const [k, v] of Object.entries(data)) t = t.split("{" + k + "}").join(v);
    return t;
  }
}

/** Exponential backoff with EQUAL JITTER: half fixed, half random. */
class RetryPolicy {
  constructor(
    private readonly baseMs: number,
    private readonly maxMs: number,
    private readonly maxAttempts: number,
    private readonly random: () => number, // injected → deterministic tests
  ) {}

  delayFor(attempt: number): number {
    const base = Math.min(this.maxMs, this.baseMs * 2 ** (attempt - 1)); // 1s 2s 4s 8s
    return Math.floor(base / 2 + this.random() * (base / 2)); // de-synchronise
  }
  exhausted(attempt: number): boolean {
    return attempt >= this.maxAttempts;
  }
}

class DeadLetterQueue {
  readonly entries: string[] = [];
  add(n: Notification, reason: string): void {
    n.status = "DEAD_LETTER";
    this.entries.push(n.channel + " " + n.key + " after " + n.attempt + " attempt(s): " + reason);
  }
}

/** Ordered by (priority, readyAt) — an OTP never waits behind a promo blast. */
class NotificationQueue {
  private items: Notification[] = [];

  offer(n: Notification): void {
    this.items.push(n);
    this.items.sort((a, b) => a.priority - b.priority || a.readyAt - b.readyAt);
  }
  get empty(): boolean {
    return this.items.length === 0;
  }
  nextReadyAt(): number {
    return this.items.length === 0 ? -1 : Math.min(...this.items.map((n) => n.readyAt));
  }
  poll(now: number): Notification | null {
    const i = this.items.findIndex((n) => n.readyAt <= now);
    return i === -1 ? null : this.items.splice(i, 1)[0];
  }
}

class NotificationService {
  private readonly dedup = new Set<string>();
  deduped = 0;

  constructor(
    private readonly prefs: PreferenceStore,
    private readonly templates: TemplateStore,
    private readonly queue: NotificationQueue,
  ) {}

  /** Resolve → render → dedup → ENQUEUE. It never calls send(). */
  publish(event: DomainEvent, quietHours = false, now = 0): number {
    let made = 0;
    for (const channel of this.prefs.channelsFor(event.userId, event.type, quietHours)) {
      const body = this.templates.render(event.type, channel, "en", event.data);
      if (body === null) continue;
      const key = [event.userId, event.type, event.entityId, channel].join(":");
      if (this.dedup.has(key)) { this.deduped += 1; continue; } // at-least-once needs this
      this.dedup.add(key);
      this.queue.offer({
        key, userId: event.userId, destination: event.userId + "@dest", body, channel,
        priority: PRIORITY_OF[event.type], attempt: 1, readyAt: now, status: "PENDING",
      });
      made += 1;
    }
    return made;
  }
}

class Dispatcher {
  private readonly channels = new Map<ChannelType, Channel>();
  sent = 0;
  retried = 0;

  constructor(
    private readonly queue: NotificationQueue,
    channels: Channel[],
    private readonly policy: RetryPolicy,
    private readonly dlq: DeadLetterQueue,
  ) {
    for (const c of channels) this.channels.set(c.type, c);
  }

  /** Simulated clock so the demo is deterministic — a real worker would block on the queue. */
  drain(startAt = 0): void {
    let now = startAt;
    while (!this.queue.empty) {
      const n = this.queue.poll(now);
      if (n === null) { now = this.queue.nextReadyAt(); continue; } // jump to next ready time
      console.log("  t=" + String(now).padStart(5) + "ms  " + n.channel + " attempt " + n.attempt);
      const result = this.channels.get(n.channel)!.send(n);

      if (result.kind === "SUCCESS") {
        n.status = "SENT";
        this.sent += 1;
      } else if (result.kind === "PERMANENT") {
        this.dlq.add(n, result.reason); // ZERO retries
        console.log("      -> dead-letter immediately (" + result.reason + ")");
      } else if (this.policy.exhausted(n.attempt)) {
        this.dlq.add(n, "exhausted: " + result.reason);
        console.log("      -> dead-letter after " + n.attempt + " attempts");
      } else {
        const delay = this.policy.delayFor(n.attempt);
        n.attempt += 1;
        n.status = "RETRYING";
        n.readyAt = now + delay;
        this.retried += 1;
        this.queue.offer(n);
        console.log("      -> retry in " + delay + "ms (jittered)");
      }
    }
  }
}

// --- demo -------------------------------------------------------------------
const prefs = new PreferenceStore();
prefs.enable("U-2", "ORDER_SHIPPED", "SMS");
prefs.enable("U-2", "ORDER_SHIPPED", "PUSH"); // email deliberately OFF
prefs.enable("U-2", "OTP_REQUESTED", "SMS");

const templates = new TemplateStore();
templates.put("ORDER_SHIPPED", "SMS", "en", "{orderId} shipped. Track: sub.rt/{orderId}");
templates.put("ORDER_SHIPPED", "PUSH", "en", "On its way - order {orderId} has shipped");
templates.put("OTP_REQUESTED", "SMS", "en", "Your code is {code}. Valid 5 minutes.");

// a tiny seeded PRNG so the printed delays are reproducible
let seed = 7;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

const queue = new NotificationQueue();
const notifier = new NotificationService(prefs, templates, queue);
const dlq = new DeadLetterQueue();

const sms = new FakeChannel("SMS", 160, [
  { kind: "RETRYABLE", reason: "503 from provider" },
  { kind: "RETRYABLE", reason: "timeout" },
  { kind: "SUCCESS", providerId: "sm-77" },
]);
const push = new FakeChannel("PUSH", 120);
const dispatcher = new Dispatcher(queue, [sms, push], new RetryPolicy(1000, 8000, 4, rand), dlq);

console.log("-- publish OrderShipped for U-2 --");
console.log("  " + notifier.publish({
  type: "ORDER_SHIPPED", userId: "U-2", entityId: "ORD-91", data: { orderId: "ORD-91" },
}) + " notifications (email is off for this user+event)");
dispatcher.drain();

console.log("-- the same event again (upstream retried) --");
console.log("  " + notifier.publish({
  type: "ORDER_SHIPPED", userId: "U-2", entityId: "ORD-91", data: { orderId: "ORD-91" },
}) + " notifications, deduped " + notifier.deduped);

console.log("-- OTP to a number the provider rejects --");
const q2 = new NotificationQueue();
const n2 = new NotificationService(prefs, templates, q2);
n2.publish({ type: "OTP_REQUESTED", userId: "U-2", entityId: "LOGIN-5", data: { code: "402913" } }, true);
const badSms = new FakeChannel("SMS", 160, [{ kind: "PERMANENT", reason: "invalid number" }]);
new Dispatcher(q2, [badSms], new RetryPolicy(1000, 8000, 4, rand), dlq).drain();

console.log("-- dead-letter queue --");
for (const e of dlq.entries) console.log("  " + e);

/* expected output (delays vary only with the seed)

-- publish OrderShipped for U-2 --
  2 notifications (email is off for this user+event)
  t=    0ms  SMS attempt 1
    SMS      -> RETRYABLE  [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
      -> retry in 812ms (jittered)
  t=    0ms  PUSH attempt 1
    PUSH     -> SUCCESS    [36 chars] On its way - order ORD-91 has shipped
  t=  812ms  SMS attempt 2
    SMS      -> RETRYABLE  [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
      -> retry in 1377ms (jittered)
  t= 2189ms  SMS attempt 3
    SMS      -> SUCCESS    [36 chars] ORD-91 shipped. Track: sub.rt/ORD-91
-- the same event again (upstream retried) --
  0 notifications, deduped 2
-- OTP to a number the provider rejects --
  t=    0ms  SMS attempt 1
    SMS      -> PERMANENT  [37 chars] Your code is 402913. Valid 5 minutes.
      -> dead-letter immediately (invalid number)
-- dead-letter queue --
  SMS U-2:OTP_REQUESTED:LOGIN-5:SMS after 1 attempt(s): invalid number
*/`,
      },
    ],
    whenToUse: [
      { type: "h", text: "The shape you just learned" },
      {
        type: "p",
        text: "Strip the notifications away and this is **an unreliable side effect, decoupled from the thing that caused it**. A caller states a fact; a separate pipeline decides what to do about it and owns the consequences of failing. Once you see that shape you will find it everywhere, and the same four moves apply every time: a **three-way result**, **bounded jittered retry**, a **dead-letter queue**, and an **idempotency key**.",
      },
      {
        type: "ul",
        items: [
          "**Webhook delivery** — you POST to a customer's URL. It times out, or it returns 410 Gone. Identical problem, identical answer, and the dead-letter queue becomes a page in their dashboard.",
          "**Payment capture and refunds** — at-least-once with an idempotency key is not optional there; it is the difference between one charge and three.",
          "**Search and cache invalidation** — index writes fail, and retrying them forever against a document that no longer exists is the same permanent-failure bug.",
          "**Audit and analytics event shipping** — the producer must not block on the sink, which is why the queue comes first, exactly as in [[producer-consumer]].",
          "**Any outbound integration at all.** The moment your code calls something you do not operate, you own retry classification, backoff and a place for the corpses.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The 25-second version to say out loud",
        text: "*“Publishers emit events, never notifications. The service resolves preferences and per-channel templates — both data — builds a notification with a stable idempotency key, and enqueues it. Workers send it through a `Channel` interface that returns success, retryable or permanent. Retryable gets exponential backoff with jitter up to a cap, then a dead-letter queue. Permanent goes to the dead-letter queue with zero retries. At-least-once delivery plus idempotency.”* That is the whole design, and it fits in one breath.",
      },
      { type: "h", text: "Where this design stops working" },
      {
        type: "ul",
        items: [
          "**When ordering matters.** *“Shipped”* must not arrive after *“delivered”*. A priority queue plus jittered retries actively reorders things. If order matters you need a per-user or per-entity sequence and a channel that respects it — which is a real cost, so only pay it where it is genuinely required.",
          "**When the in-process queue dies with the process.** Everything still pending is gone. At interview scale say so out loud and name the fix: persist the notification row before enqueuing, or use a durable broker. The classes do not change; the queue's implementation does.",
          "**When exactly-once is actually required.** It does not exist end to end — you cannot stop a phone network from delivering an SMS twice. The honest answer is *at-least-once plus idempotency at every consumer*, and pretending otherwise is a worse answer than admitting it.",
          "**When the user is offline for a week.** Retrying a push for seven days is pointless; the notification should expire. Add a `expiresAt` and drop instead of dead-lettering — an expired promo is not an incident.",
          "**When one user has millions of events.** Per-user rate limiting and digesting stop being a nicety and become the primary design constraint, and the whole thing tilts toward the batching model instead of the per-event one.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "If you only remember one thing",
        text: "**`send()` returning a boolean is the bug.** Everything good in this design — the backoff ladder, the dead-letter queue, not hammering a provider with a number that will never work — depends on the channel being able to say *“try again”* and *“never try again”* as two different answers.",
      },
    ],

    tradeoffs: {
      pros: [
        "Publishers stay ignorant of channels, so adding WhatsApp is one class and some preference rows with zero edits to any service that emits events.",
        "Preferences and templates are rows, so a new event type, a new language or a user changing their mind is configuration rather than a deploy.",
        "A three-way DeliveryResult lets the dispatcher retry temporary failures and abandon permanent ones, which is what stops retry storms against addresses that can never work.",
        "Exponential backoff with jitter spreads a thousand simultaneous failures across a window instead of firing them as one synchronised spike at an already-struggling provider.",
        "A stable idempotency key makes at-least-once delivery safe, so retries and duplicate publishes cost nothing instead of double-sending.",
      ],
      cons: [
        "Asynchronous delivery means the caller gets no confirmation, so 'did it send?' becomes a separate status lookup and a support surface of its own.",
        "The priority queue reorders messages, so notifications about the same entity can arrive out of sequence unless you add per-entity ordering on top.",
        "An in-process queue loses everything pending if the process dies; durability means persisting notifications first, which adds a write to the hot path.",
        "The dedup store is unbounded unless you give keys a TTL, and picking that TTL is a real trade between memory and how long a duplicate can still arrive.",
        "A dead-letter queue nobody monitors is just a slower way to lose messages — the design only pays off if someone alerts on its growth rate.",
      ],
    },

    furtherReading: [
      {
        label: "Exponential Backoff and Jitter — AWS Architecture Blog",
        href: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/",
        kind: "article",
        note: "The canonical write-up, with the simulation that shows full jitter beating plain exponential backoff. Read this one first — it is the source of the money figure in this lesson.",
      },
      {
        label: "Timeouts, retries and backoff with jitter — Amazon Builders' Library",
        href: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
        kind: "article",
        note: "Longer and more operational: retry budgets, why every layer retrying multiplies load, and when not to retry at all.",
      },
      {
        label: "Dead Letter Channel — Enterprise Integration Patterns",
        href: "https://www.enterpriseintegrationpatterns.com/patterns/messaging/DeadLetterChannel.html",
        kind: "docs",
        note: "The pattern by its formal name, alongside Guaranteed Delivery and Idempotent Receiver — the vocabulary that makes this design sound routine rather than invented on the spot.",
      },
      {
        label: "Amazon SQS dead-letter queues",
        href: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
        kind: "docs",
        note: "How a production queue actually implements maxReceiveCount and redrive. Useful for answering 'and how would you run this?' concretely.",
      },
      {
        label: "Stripe: Idempotent Requests",
        href: "https://docs.stripe.com/api/idempotent_requests",
        kind: "docs",
        note: "Idempotency keys as a public API contract, including the TTL. The clearest short example of the exact mechanism this lesson uses.",
      },
      {
        label: "Twilio SMS character limits and segments",
        href: "https://help.twilio.com/articles/360033806753-Message-Character-and-Segment-Limits",
        kind: "docs",
        note: "Why 160 characters is a real constraint with a real per-segment cost — the concrete fact behind 'templates are per channel'.",
      },
      {
        label: "Designing Data-Intensive Applications — Kleppmann",
        kind: "book",
        note: "Chapter 11 on message brokers, at-least-once delivery and why exactly-once is a marketing term. The theory under everything in this lesson.",
      },
    ],

    quiz: [
      {
        id: "notification-system-q1",
        question: "The order service needs to tell a customer their parcel shipped. What should it call?",
        options: [
          { id: "a", label: "`notifier.publish(new OrderShipped(orderId, userId))` — a fact, with no channel, address or subject in it." },
          { id: "b", label: "`emailClient.send(user.email, subject, body)` — it is the service that knows the order details." },
          { id: "c", label: "`smsChannel.send(...)` and `emailChannel.send(...)`, so both channels are covered." },
          { id: "d", label: "`notifier.sendEmail(userId, template)` — one call, and the notifier still owns the sending." },
        ],
        correctOptionId: "a",
        explanation:
          "The publisher states what happened; something else decides who hears about it and how. (d) is the tempting near-miss — it does route through the notifier, but the method name still hardcodes the channel, so adding WhatsApp still means editing the order service.",
      },
      {
        id: "notification-system-q2",
        question: "Why must `Channel.send()` return three outcomes rather than a boolean?",
        options: [
          { id: "a", label: "Because a timeout might succeed on a retry while an invalid number never will, and a boolean cannot tell the dispatcher which case it is in." },
          { id: "b", label: "Because three return values are faster to check than one." },
          { id: "c", label: "Because each channel needs a different return type." },
          { id: "d", label: "It does not matter — the dispatcher can just retry everything a few times and stop." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is the answer most candidates give and it is the one that costs the round: retrying a permanent failure burns provider quota on a message that can never be delivered, and at scale it is a real incident. The classification also has to happen inside the channel, since only it understands its provider's error codes.",
      },
      {
        id: "notification-system-q3",
        question: "A provider blips and 1,000 sends fail in the same second. You retry with exponential backoff but no jitter. What happens?",
        options: [
          { id: "a", label: "All 1,000 retries fire at exactly the same instant, hitting a struggling provider with a synchronised spike — and again, harder, on the next round." },
          { id: "b", label: "Nothing bad — exponential backoff already spreads the load out over time." },
          { id: "c", label: "The retries are dropped because the queue is full." },
          { id: "d", label: "Each retry waits a random amount by default, so they spread naturally." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) is exactly the misconception: backoff spreads retries relative to the *first* attempt, but every message that failed together still waits the same duration and so retries together. Jitter does not reduce the number of retries — it de-synchronises them.",
      },
      {
        id: "notification-system-q4",
        question: "What is the right idempotency key for a shipped-order notification?",
        options: [
          { id: "a", label: "Something derived from the event itself, like `userId + eventType + orderId`, so restating the same fact always produces the same key." },
          { id: "b", label: "A fresh UUID generated when the notification object is created." },
          { id: "c", label: "The current timestamp in milliseconds." },
          { id: "d", label: "A hash of the rendered message body." },
        ],
        correctOptionId: "a",
        explanation:
          "(b) and (c) are the silent killers: they compile, they look like idempotency, and they make every duplicate look brand new, so the dedup check never fires. (d) is closer but breaks the moment you fix a typo in a template — the same fact would suddenly get a new key.",
      },
      {
        id: "notification-system-q5",
        question: "The interviewer asks you to add WhatsApp. In a good design, what changes?",
        options: [
          { id: "a", label: "One new class implementing `Channel`, registered at startup, plus preference and template rows — and no edits to the service or any publisher." },
          { id: "b", label: "A new branch in the dispatcher's switch on the channel name." },
          { id: "c", label: "A new `sendWhatsApp` method on `NotificationService`, called by whoever needs it." },
          { id: "d", label: "A subclass of `NotificationService` that overrides the fan-out." },
        ],
        correctOptionId: "a",
        explanation:
          "The tell that the Strategy seam is real rather than decorative is that there is no `switch` anywhere — the registry is a map from channel type to channel, filled once. (b) is the version that looks fine on a whiteboard and quietly makes every new channel a change to shared code.",
      },
      {
        id: "notification-system-q6",
        question: "Should `publish()` call `channel.send()` directly?",
        options: [
          { id: "a", label: "No — it should enqueue, so a slow provider cannot add its latency to the checkout request, and so failures have somewhere to be retried from." },
          { id: "b", label: "Yes — sending inline is simpler and gives the caller an immediate result." },
          { id: "c", label: "Yes, but only for transactional notifications." },
          { id: "d", label: "No, because sending requires a database transaction." },
        ],
        correctOptionId: "a",
        explanation:
          "There are two reasons and most candidates only give the first. Latency is the obvious one; the deeper one is that the retry ladder needs a queue to put the message back onto. Without it, a retry means blocking the caller for eight seconds or losing the message.",
      },
      {
        id: "notification-system-q7",
        question: "Marketing schedules 200,000 promos for 09:00. At 09:00:02 a user requests a login OTP. What stops the OTP arriving after lunch?",
        options: [
          { id: "a", label: "Priority: separate lanes (or a queue ordered by priority) so transactional traffic never shares a lane with promotional traffic." },
          { id: "b", label: "Nothing — FIFO is fair and the OTP will get there eventually." },
          { id: "c", label: "Making the OTP retry more aggressively than the promos." },
          { id: "d", label: "Adding more workers so the whole backlog drains faster." },
        ],
        correctOptionId: "a",
        explanation:
          "(d) is tempting because it sounds like the practical answer, but it only shortens the queue — the OTP is still behind 200,000 messages. Priority is the structural fix. Mention starvation unprompted too: a permanently busy high lane means the low lane never runs, so reserve capacity or age priority upward.",
      },
      {
        id: "notification-system-q8",
        question: "How would you unit-test that a message dead-letters after exactly four attempts?",
        options: [
          { id: "a", label: "Inject a fake channel scripted to keep returning retryable failures, and a retry policy with a fixed-seed random, then assert on the dead-letter queue." },
          { id: "b", label: "Call the real SMS provider with a number you know is offline and see what happens." },
          { id: "c", label: "Add a test-only flag inside `SmsChannel` that makes it fail." },
          { id: "d", label: "Sleep for 15 seconds in the test and check the logs afterwards." },
        ],
        correctOptionId: "a",
        explanation:
          "Both halves matter: a fake channel makes the failure controllable, and injecting the randomness makes the backoff deterministic — the same trick as passing the dice into a board game instead of calling a global random. (c) is the common shortcut, and it puts test code in the class you most want to keep honest.",
      },
    ],
  },
};
