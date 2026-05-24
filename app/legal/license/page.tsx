import Link from "next/link";
import { LegalDoc, LegalSection, LegalList } from "@/components/shared/LegalDoc";

export const metadata = {
  title: "License",
  description: "How you may reuse Subroute's prototypes and written content.",
};

export default function LicensePage() {
  return (
    <LegalDoc
      kicker="Legal"
      title="License"
      updated="May 2026"
      intro="Subroute has two kinds of material — the interactive prototype code, and the written explanations — and they are licensed differently. Here is exactly what you can do with each."
    >
      <LegalSection heading="Prototype code — MIT, fork away">
        <p>
          Each simulation is a standalone HTML/JavaScript file. That prototype
          source is released under the{" "}
          <span className="text-foreground">MIT License</span>: you may use,
          copy, modify, and build on it — including in your own projects —
          provided you keep the copyright notice. It is offered without warranty.
          Reading the source and forking a demo to make your own is genuinely
          encouraged.
        </p>
      </LegalSection>

      <LegalSection heading="Written content — yours to learn from">
        <p>
          The explanations, diagrams, and quiz text are © Yathiskumar. You are
          free to read them, quote short excerpts with attribution, and link to
          them. Please do not republish whole pages or sell the content as your
          own. For anything beyond that — translations, course material, reuse
          at scale — just ask; the answer is usually yes.
        </p>
      </LegalSection>

      <LegalSection heading="Third-party components">
        <p>
          Subroute stands on open-source work, used under their respective
          licenses:
        </p>
        <LegalList
          items={[
            "Next.js and React — MIT License.",
            "Tabler Icons — MIT License.",
            "Lucide icons — ISC License.",
            "Reference papers, docs, and articles linked from each concept remain the property of their respective authors.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Questions about reuse">
        <p>
          Not sure whether your use is covered? Ask first via the{" "}
          <Link
            href="/contact"
            className="text-foreground underline decoration-border-subtle underline-offset-4 transition-colors hover:text-accent"
          >
            Contact
          </Link>{" "}
          page — happy to clarify or grant broader permission.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
