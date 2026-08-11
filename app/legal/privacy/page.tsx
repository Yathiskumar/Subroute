import Link from "next/link";
import { LegalDoc, LegalSection, LegalList } from "@/components/shared/LegalDoc";

export const metadata = {
  title: "Privacy",
  description: "How Subroute handles your data — the short version: barely at all.",
};

function MailLink() {
  return (
    <a
      href="mailto:yathiskumar2212@gmail.com"
      className="text-foreground underline decoration-border-subtle underline-offset-4 transition-colors hover:text-accent"
    >
      yathiskumar2212@gmail.com
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Privacy"
      updated="May 2026"
      intro="Subroute is a personal, educational project. It is built to teach — not to harvest data. You can read and use everything without an account; signing in is optional and only saves your progress. This page explains the little that is collected and why."
    >
      <LegalSection heading="What is not collected">
        <LegalList
          items={[
            "No required account — you can read everything signed out. If you do sign in, all that is stored is your email and which lessons and quizzes you finished.",
            "No tracking cookies and no advertising or marketing pixels.",
            "No selling, renting, or sharing of data with advertisers. Ever.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Anonymous, aggregated analytics">
        <p>
          The site records that a page was viewed — the page path, the site that
          linked you here, a rough country, and the kind of device and browser —
          using Vercel Web Analytics and a small first-party counter of our own.
          It is used only to decide what to build and improve next.
        </p>
        <p>
          Visitors are counted with a one-way hash of your IP address and
          browser, mixed with a secret and the current date. Your IP address is
          never stored, the hash cannot be turned back into it, and because the
          date is part of it the value changes every midnight — so it can count
          how many people visited today, but it cannot follow you from one day
          to the next. No cookie is set for this.
        </p>
      </LegalSection>

      <LegalSection heading="The interactive prototypes">
        <p>
          Every simulation runs entirely inside your browser in a sandboxed
          frame. When you click, drag a slider, or start a simulation, that
          activity stays on your machine — it is not recorded or sent anywhere.
        </p>
      </LegalSection>

      <LegalSection heading="Third parties">
        <LegalList
          items={[
            "Hosting & analytics: the site is hosted on Vercel, which processes standard request logs to serve pages and provide the aggregated analytics above.",
            "Content delivery networks: icons and fonts load from public CDNs (e.g. jsDelivr). Your browser requests those files directly, and those providers may log the request under their own policies.",
            "Outbound links (such as LinkedIn or reference articles) take you to sites with their own, separate privacy practices.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Changes & questions">
        <p>
          If this policy changes, the “last updated” date above will change with
          it. Questions about your data are welcome at <MailLink /> — or see the{" "}
          <Link
            href="/contact"
            className="text-foreground underline decoration-border-subtle underline-offset-4 transition-colors hover:text-accent"
          >
            Contact
          </Link>{" "}
          page.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
