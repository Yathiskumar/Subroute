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
      intro="Subroute is a personal, educational project. It is built to teach — not to harvest data. There are no accounts, no logins, and nothing for you to sign up for. This page explains the little that is collected and why."
    >
      <LegalSection heading="What is not collected">
        <LegalList
          items={[
            "No accounts or profiles — you never create one, so there is nothing personal to store.",
            "No tracking cookies and no advertising or marketing pixels.",
            "No selling, renting, or sharing of data with advertisers. Ever.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Anonymous, aggregated analytics">
        <p>
          The site uses privacy-friendly analytics (Vercel Web Analytics) to
          understand which topics people actually read — for example, that a
          page was viewed, roughly from where, and on what kind of device. This
          data is aggregated and is not tied to your identity. It carries no
          names, emails, or persistent cross-site identifiers, and it is used
          only to decide what to build and improve next.
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
