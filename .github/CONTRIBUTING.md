# Contributing

This is my personal site, so the honest version up front: I am not looking for
features, redesigns, or refactors. The design decisions are deliberate and mostly
documented in [AGENTS.md](../AGENTS.md), and a pull request that changes them will
probably be declined regardless of how good the code is.

What I am glad to receive:

- **Typos and grammar** in the posts. They are in French, and things slip
  through.
- **Factual or technical corrections.** If a post gets .NET, EF Core, or
  anything else wrong, I would rather know. Open an issue or a pull request.
- **Broken things.** Dead links, a layout that collapses at some viewport, a
  component that traps keyboard focus, an accessibility problem.
- **Security issues**, via [SECURITY.md](SECURITY.md) rather than a public issue.

Feel free to fork it and build your own site from it. That is what the MIT license
on the code is for. See [COPYRIGHT.md](../COPYRIGHT.md): it covers the code only,
so the posts, their covers and the logo are not included.

## Working on it

`pnpm` only, pinned to the version in `packageManager`. Not npm, not yarn.

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run what CI runs:

```bash
pnpm lint && pnpm typecheck && pnpm test
```

CI gates on lint, typecheck, coverage, then build, in that order. Breaking any of
them blocks the deploy, so it is faster to find out locally.

Two things that catch people out:

- **Do not run `pnpm build` while `pnpm dev` holds port 3000.** They fight over
  Turbopack's CSS state, and the corruption shows up later as unrelated styling
  bugs. Stop the dev server first.
- **Component tests need `// @vitest-environment jsdom` as the first line.** The
  global environment is `node`, and without the docblock `render()` fails with an
  error that does not name the cause.

[AGENTS.md](../AGENTS.md) has the rest: the spacing ramp, where code goes, the
typography rules, and why there is no `tailwind.config.js`. Worth a read before
touching anything visual, since almost nothing in there is enforced by tooling.

## Prose conventions

Post prose and interface copy are French. Identifiers and code comments are
English.

No em dashes or en dashes anywhere, including in commit messages. Use a colon, a
comma, or parentheses. French takes a space before the colon, English does not.

## Commits

Conventional commits, lowercase, no trailing period: `fix: correct EF Core lazy
loading example`. Keep them scoped to one thing.
