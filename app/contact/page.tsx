import { Mail, ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

function LinkedinIcon({
  className,
  strokeWidth,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export const metadata = {
  title: "Contact",
  description: "Get in touch with the maker of Subroute.",
};

const EMAIL = "yathiskumar2212@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/yathiskumar-d-267033251/";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    hint: "Best for questions, corrections, and collaboration.",
    external: false,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "in/yathiskumar-d",
    href: LINKEDIN,
    hint: "Connect, or reach out about work and ideas.",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="container py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="mt-8 max-w-3xl">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">Contact</p>
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          Say hello.
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted">
          Subroute is built and maintained by Yathiskumar. Found a bug in a
          prototype, spotted something inaccurate, or want to talk about an idea?
          The fastest way to reach me is below.
        </p>
      </div>

      <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {CHANNELS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noopener noreferrer" : undefined}
            className="group flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-6 transition-colors hover:border-border"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-border-subtle bg-surface">
                <c.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
              </span>
              <ArrowUpRight className="h-4 w-4 text-subtle transition-colors group-hover:text-accent" />
            </div>
            <div>
              <p className="kicker">{c.label}</p>
              <p className="mt-1 break-all font-medium text-foreground">
                {c.value}
              </p>
            </div>
            <p className="text-sm text-muted">{c.hint}</p>
          </a>
        ))}
      </div>

      <p className="mt-8 max-w-3xl text-sm text-subtle">
        I read everything but reply when I can — this is a personal project, not
        a company inbox. For anything about how your data is handled, see the{" "}
        <a
          href="/legal/privacy"
          className="text-muted underline decoration-border-subtle underline-offset-4 transition-colors hover:text-foreground"
        >
          Privacy
        </a>{" "}
        page.
      </p>
    </div>
  );
}
