# Contributing to Subroute

First off — thank you for taking the time to contribute! 🎉 Every contribution, no matter how small, helps make Subroute better.

This document explains how to get set up, the conventions we follow, and how to submit changes.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Conventions](#project-conventions)
- [Adding a Topic or Prototype](#adding-a-topic-or-prototype)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold it. Please report unacceptable behavior.

---

## Ways to Contribute

- 🐛 **Report bugs** — open a [bug report](https://github.com/Yathiskumar/Subroute/issues/new?template=bug_report.md).
- 💡 **Suggest features** — open a [feature request](https://github.com/Yathiskumar/Subroute/issues/new?template=feature_request.md).
- 🎮 **Build a prototype** — add an interactive simulation for a concept.
- 📝 **Add a topic** — extend the topic catalog with a new CS/system-design subject.
- 🎨 **Improve UI/UX** — polish components while respecting the design system.
- 📖 **Improve docs** — fix typos, clarify instructions, add examples.

---

## Development Setup

> **Prerequisites:** Node.js 18+ and [pnpm](https://pnpm.io/).

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/Subroute.git
cd Subroute

# 2. Install dependencies
pnpm install

# 3. Start the dev server
pnpm dev   # http://localhost:3000
```

Before pushing, always run:

```bash
pnpm typecheck   # tsc --noEmit must pass
pnpm lint        # next lint must pass
pnpm build       # production build must succeed
```

---

## Project Conventions

- **TypeScript strict.** No `any` without a clear reason.
- **No hex codes in components.** All colors, surfaces, and accents must resolve to the CSS variables / Tailwind semantic tokens defined in `styles/globals.css` and `tailwind.config.ts`.
- **Components stay small and focused.** Put base primitives in `components/ui/`, layout pieces in `components/layout/`, and shared widgets in `components/shared/`.
- **Data is typed.** New topics/concepts must conform to the types in `lib/types/index.ts`.
- **Prototypes are self-contained.** No build step — plain HTML/CSS/JS only.

---

## Adding a Topic or Prototype

**New topic** — add a typed entry to `lib/data/topics.ts`. The app picks it up across the homepage grid, `/topics`, and the nested routes automatically.

**New prototype:**

1. Add a standalone file at `public/prototypes/<topic-slug>/<concept-slug>.html`.
2. Set `prototypePath` on the matching concept in `lib/data/topics.ts`.

See `public/prototypes/demo/demo.html` for a working reference. Full instructions are in the [README](./README.md#-adding-content).

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>(<optional scope>): <description>

feat(topics): add circuit breakers topic
fix(prototype): correct iframe sandbox flags
docs(readme): clarify pnpm setup
style(ui): align badge padding
refactor(lib): simplify slug helper
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

---

## Pull Request Process

1. Create a branch from `main`: `git checkout -b feat/short-description`.
2. Make focused, minimal changes that address one thing.
3. Ensure `pnpm typecheck`, `pnpm lint`, and `pnpm build` all pass.
4. Update documentation if behavior changes.
5. Open a PR against `main` with a clear title and description, linking any related issue.
6. Be responsive to review feedback. 🙌

A maintainer will review your PR as soon as possible.

---

## Reporting Bugs

Before opening an issue, please search [existing issues](https://github.com/Yathiskumar/Subroute/issues) to avoid duplicates. When filing a bug, include:

- A clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Environment (OS, browser, Node version)
- Screenshots if relevant

---

Thank you again for contributing! ❤️
