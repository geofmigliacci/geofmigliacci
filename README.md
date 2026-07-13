# geofmigliacci

[![CI](https://github.com/geofmigliacci/geofmigliacci/actions/workflows/ci.yml/badge.svg)](https://github.com/geofmigliacci/geofmigliacci/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/geofmigliacci/geofmigliacci/graph/badge.svg)](https://codecov.io/gh/geofmigliacci/geofmigliacci)

Personal site for Geoffrey Migliacci, with technical articles on backend engineering — an MDX-powered Next.js app with full SEO/PWA setup and near-complete test coverage.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) + [Base UI](https://base-ui.com/) components
- [MDX](https://mdxjs.com/) article content, syntax-highlighted with [Shiki](https://shiki.style/) via `rehype-pretty-code`
- [Motion](https://motion.dev/) for animation
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit tests
- [Biome](https://biomejs.dev/) for linting and formatting

## Highlights

- MDX-based articles with reading-time estimates, tag filtering, and adjacent-article navigation
- SEO: sitemap, robots, JSON-LD structured data, and per-page OpenGraph images generated at build time
- PWA-ready: manifest, static app icons (including maskable), theme color
- ~99% statement coverage across the codebase, enforced in CI alongside lint, typecheck, and build

## Development

```bash
pnpm dev          # start the dev server
pnpm build        # production build
pnpm lint         # biome check
pnpm typecheck    # tsc --noEmit
pnpm test         # run unit tests
pnpm test:coverage # run unit tests with coverage
```
