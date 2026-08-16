# geofmigliacci.dev

[![CI](https://github.com/geofmigliacci/geofmigliacci.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/geofmigliacci/geofmigliacci.dev/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/geofmigliacci/geofmigliacci.dev/graph/badge.svg)](https://codecov.io/gh/geofmigliacci/geofmigliacci.dev)
[![geofmigliacci.dev](https://img.shields.io/website?url=https%3A%2F%2Fwww.geofmigliacci.dev&label=geofmigliacci.dev&up_color=brightgreen&down_color=red)](https://www.geofmigliacci.dev)

Source for [geofmigliacci.dev](https://www.geofmigliacci.dev), my personal site and
engineering blog. I am a senior software engineer working on .NET backends, mostly
on keeping systems standing as load arrives, and this is where I write about that
and whatever else holds my attention.

The articles and the interface are in French. Identifiers, code comments and this
file are English.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16.3, App Router, Turbopack |
| UI | React 19.2, Server Components by default |
| Styling | Tailwind CSS v4, CSS first, no `tailwind.config.js` |
| Components | shadcn/ui on the `base-nova` style, over Base UI rather than Radix |
| Animation | `motion` |
| Content | MDX, with `rehype-pretty-code` and Shiki for highlighting |
| Tooling | Biome 2.5 for lint and format, not ESLint or Prettier |
| Tests | Vitest 4 and Playwright |
| Package manager | pnpm, pinned via `packageManager` |
| Hosting | Vercel |

## Running it

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run what CI runs:

```bash
pnpm check
```

**Do not run `pnpm build` while a dev server holds port 3000.** The two fight over
Turbopack's CSS state, and the corruption surfaces later as unrelated styling bugs.
Stop the dev server first.

[.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) covers the rest of the workflow.
[AGENTS.md](AGENTS.md) documents the decisions behind the code: the spacing ramp,
where components go, the typography rules, and why several things that look
removable are not. Almost none of it is enforced by tooling, so it is worth reading
before changing anything visual.

## Testing

Unit tests are colocated as `*.test.ts(x)` beside their source and run under
Vitest. They query by role and accessible name rather than by test id, which makes
the suite double as an accessibility check.

The Playwright suite in [e2e/](e2e/) builds the site and serves it on port 3100, so
it tests the artifact that actually deploys rather than a dev server. Its most
valuable assertion is that the browser console stays empty, which is what caught a
hydration mismatch on the 404 route.

Coverage has deliberate exclusions, listed in [vitest.config.ts](vitest.config.ts).
Some of what is left uncovered cannot be reached from jsdom at all: scroll driven
components degrade to a no op there, so those are verified in a browser instead.

## Quality gates

[CI](.github/workflows/ci.yml) runs lint, typecheck, coverage and build, with the
Playwright suite alongside as its own job. Every one of them has to pass before
anything deploys to Vercel.

## Licensing

MIT for the code, but the repository is not uniformly MIT and the difference
matters. [COPYRIGHT.md](COPYRIGHT.md) sets out the split:

- **MIT**: `src/`, `scripts/`, and the root configuration. Fork it, adapt it, ship
  it commercially.
- **Free to copy, no attribution**: the code snippets inside the articles.
- **All rights reserved**: the articles in `content/`, their cover images, the
  photographs, and the logo. Note that three logo files live under `src/`, so
  "everything in `src/` is MIT" would be wrong.

## Security

There is no login, no database and no input surface here, which rules out most
categories. [.github/SECURITY.md](.github/SECURITY.md) covers what is still worth
reporting and how to report it privately.
