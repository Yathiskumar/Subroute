import Link from "next/link";
import { LegalDoc, LegalSection, LegalList } from "@/components/shared/LegalDoc";

export const metadata = {
  title: "Terms",
  description: "The terms for using Subroute — an educational project, offered as-is.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="Terms of Use"
      updated="May 2026"
      intro="Subroute is a free, educational project. By using the site you agree to these straightforward terms. They exist to set expectations, not to trap you."
    >
      <LegalSection heading="What Subroute is">
        <p>
          Subroute teaches computer-science and system-design concepts through
          written explanations and interactive prototypes. It is a learning
          resource made by an individual, not a commercial product, a
          certification, or professional advice.
        </p>
      </LegalSection>

      <LegalSection heading="Educational use, provided “as is”">
        <LegalList
          items={[
            "The content and prototypes are provided for learning, as-is, without warranties of any kind — including accuracy, completeness, or fitness for a particular purpose.",
            "Prototypes are deliberately simplified models built to build intuition. They are not production implementations and should not be copied verbatim into real systems.",
            "Always verify anything important against primary sources and your own testing before relying on it. Each concept links to its references for exactly this reason.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Using the material">
        <p>
          You are welcome to read, learn from, and share links to anything here.
          Reuse of the prototype source and the written content is governed by
          the{" "}
          <Link
            href="/legal/license"
            className="text-foreground underline decoration-border-subtle underline-offset-4 transition-colors hover:text-accent"
          >
            License
          </Link>
          . Please do not present the material as your own or republish it
          wholesale without credit.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the extent permitted by law, the author is not liable for any loss
          or damage arising from use of this site or its contents. You use the
          information and prototypes at your own discretion and risk.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          These terms may be updated as the project evolves; the “last updated”
          date above reflects the current version. Questions? Reach out via the{" "}
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
