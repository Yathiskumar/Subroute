import Link from "next/link";
import { Logo } from "./Logo";

const SECTIONS = [
  {
    title: "Explore",
    links: [
      { href: "/topics", label: "All topics" },
      { href: "/playground", label: "Playground" },
      { href: "/topics/rate-limiting", label: "Rate Limiting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/about", label: "About" },
      { href: "#", label: "Changelog" },
      { href: "#", label: "Roadmap" },
      { href: "#", label: "Brand kit" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "#", label: "GitHub" },
      { href: "#", label: "Discord" },
      { href: "#", label: "Twitter" },
      { href: "#", label: "Contributors" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
      { href: "#", label: "License" },
      { href: "#", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border-subtle bg-surface-sunken/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted">
              An interactive playground for technical concepts. Learn by
              touching the system, not just reading about it.
            </p>
            <p className="font-mono text-2xs uppercase tracking-wider text-subtle">
              v0.1 · scaffold
            </p>
          </div>
          {SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <p className="kicker">{section.title}</p>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-6 md:flex-row md:items-center">
          <p className="text-xs text-subtle">
            © {new Date().getFullYear()} Subroute. Built as a learning scaffold.
          </p>
          <p className="font-mono text-2xs uppercase tracking-wider text-subtle">
            built with curiosity ↗
          </p>
        </div>
      </div>
    </footer>
  );
}
