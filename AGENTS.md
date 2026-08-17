<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- Everything below is hand-written. `next dev` rewrites the block above verbatim
     on every start, so edits inside its markers do not survive: change nothing there. -->

## Commands

`pnpm` only, pinned to `pnpm@11.22.0` via `packageManager`. Never npm or yarn.

| Command | What it runs |
| --- | --- |
| `pnpm dev` | Dev server on :3000 |
| `pnpm lint` | **Biome** (`biome check`), not ESLint |
| `pnpm format` | `biome format --write` |
| `pnpm typecheck` | `next typegen && tsc --noEmit` |
| `pnpm test` | Vitest, single run |
| `pnpm test:coverage` | Vitest with v8 coverage, what CI gates on |
| `pnpm e2e` | Playwright smoke suite, builds and serves on :3100 itself |
| `pnpm e2e:ui` | The same suite in Playwright's UI mode |
| `pnpm icons` | Regenerates PWA icons from the brand gradient in `globals.css` |

**Do not run `pnpm build` while a dev server holds :3000.** The two fight over
Turbopack's CSS state and leave it corrupted, which then presents as unrelated
styling bugs. Stop the dev server first. `pnpm e2e` runs a build of its own, so
the same applies to it: it serves on :3100 to keep off the dev server's port, but
the port was never what collided.

## Stack facts that contradict training data

- **Next 16.3**, App Router. See the banner above: read `node_modules/next/dist/docs/` rather than recalling.
- **React 19.2**. Server Components by default; 21 files opt into `"use client"`.
- **Tailwind v4**, CSS-first. There is no `tailwind.config.js` and adding one is wrong. Tokens live in `@theme` / `@theme inline` in [src/app/globals.css](src/app/globals.css).
- **Biome 2.5**, not ESLint and not Prettier.
- **Vitest 4**, not Jest.
- **shadcn/ui** on the `base-nova` style over **Base UI** (`@base-ui/react`), not Radix. Config in [components.json](components.json).
- The animation package is **`motion`**, imported from `motion/react`. Not `framer-motion`.
- **next-intl 4** for i18n, and **`src/proxy.ts`**, not `middleware.ts`, which Next 16 deprecated.

## Language

The site is bilingual through **next-intl**: English at `/en`, French at `/fr`,
English the default. Identifiers and code comments are **English**. Authoring
comments inside `content/blog/` are French.

- **No user-facing string belongs in a component.** It goes in
  [src/messages/en.json](src/messages/en.json) and its French counterpart, and
  reaches the component through `useTranslations` (isomorphic: Server and Client
  alike) or `getTranslations` where the caller is already async. That includes
  `aria-label`, `alt`, and anything a screen reader would read.
- **English is structurally the source of truth.** [global.d.ts](global.d.ts)
  types the catalogue from `en.json`, so a key only one locale has fails `tsc`
  rather than rendering blank. [messages.test.ts](src/messages/messages.test.ts)
  catches the case types cannot see: a key present, and empty.
  **It must stay `declare module "next-intl"`.** next-intl reads `AppConfig` from
  its own module, so `declare global { interface AppConfig }` compiles, looks
  right, and types nothing: `t("no.such.key")` and `useLocale()` widen to `string`
  in silence. The tell is a `useLocale() as Locale` cast being *needed* somewhere.
  A dynamic key must therefore resolve to a real union, which is why
  `nav.sections` gives all four entries a `short` and
  [about-photos.tsx](src/app/[locale]/about/_components/about-photos.tsx) is
  `as const`.
- **`useTranslations` in a Server Component does not need `async`.** Making a
  component async to reach `getTranslations` costs it its test, since RTL cannot
  render an async Server Component.
- Plurals are ICU, not hand-written branches. Interpolated markup goes through
  `t.rich`, as the two legal pages do for their inline links.
- `src/i18n/client-messages.ts` lists the namespaces a Client Component reads.
  `NextIntlClientProvider` forwards the **whole** catalogue otherwise, and the
  legal pages are most of it while rendering server side only.
- **Every internal link goes through `Link` from
  [src/i18n/navigation.ts](src/i18n/navigation.ts)**, which adds the prefix.
  `next/link` stays for nothing, and a bare `<a>` only for `#content`, `mailto:`,
  off-site URLs, and
  [language-switcher.tsx](src/components/language-switcher.tsx), which needs the
  full document load the next section explains.
- Dates go through [src/lib/format.ts](src/lib/format.ts), not next-intl's
  formatter, and the locale argument is required. It pins `timeZone: "UTC"`,
  without which a reader west of it dates a post the day before; the two
  timezone cases in [format.test.ts](src/lib/format.test.ts) are that guard.
- **`LANGUAGE_TAG` is regional, `hreflang` is not.** English formats and cards
  as `en-US`, which is what `Intl` and schema.org's `inLanguage` want, but the
  URL segment and every `hreflang` stay a bare `en`: a regional annotation would
  offer the English pages to the US alone and drop a British or Indian searcher
  through to `x-default`.

The easiest thing to break silently is still the copy itself: a French label
left in `en.json` fails no test and breaks no build, it just reads wrong.

## Routing and the proxy

- `middleware.ts` is **deprecated in Next 16**. The file is
  [src/proxy.ts](src/proxy.ts), it exports `proxy`, and it is Node-runtime only.
- It wraps next-intl's `createMiddleware` for one reason: **next-intl sets no
  `Vary` header**, and without one a shared cache can serve the language it
  negotiated for one visitor to everyone behind them.
  [e2e/locale.spec.ts](e2e/locale.spec.ts) asserts it.
- `redirects()` in [next.config.ts](next.config.ts) runs **before** the proxy, so
  `/articles/:slug` still answers 308 to `/blog/:slug` and the browser
  re-requests. That is why [e2e/redirects.spec.ts](e2e/redirects.spec.ts) needed
  no changes for i18n, and it is worth keeping that way.
- **`experimental.globalNotFound` is on, and load-bearing.** An unmatched URL
  never reaches `[locale]`, so the layout cannot render it and
  `[locale]/not-found.tsx` is never the boundary: Next serves its own unstyled
  404 instead. [src/app/global-not-found.tsx](src/app/global-not-found.tsx) owns
  the whole document, so it restates the fonts and the theme script the way
  `global-error.tsx` does, and reads its locale from the request rather than a
  segment. Do not try to replace it with a catch-all route: one renders our 404
  but returns **200**, because `loading.tsx`'s Suspense boundary flushes the
  shell before `notFound()` is raised.
- `setRequestLocale(locale)` belongs in every page and layout. Omitting it is
  silent: the page still renders, it just stops being static. The build's route
  table is the only place that shows.
- The request config prefers an explicitly passed locale over `requestLocale`,
  which reads headers. Without that, `generateStaticParams` and
  `generateImageMetadata` fail at build time, where there is no request.
- **Routes are typed by `PageProps` / `LayoutProps` / `RouteContext`**, the
  generated helpers, against a route literal like `'/[locale]/blog/[slug]'`. They
  need no import. `pnpm typecheck` runs `next typegen` first, which is what makes
  them exist on a fresh checkout where `.next/` does not: do not drop that half of
  the command. They type `[locale]` as `string`, because a folder name says
  nothing about which values are legal, so pages narrow it through
  [`toLocale`](src/i18n/params.ts). `feed.xml` keeps its own `hasLocale` check
  instead: `notFound()` means nothing in a route handler, which owes the client a
  response.
- **`next/root-params` is deliberately not used**, though the i18n guide
  recommends it. next-intl's `getLocale()` already gives a request-scoped locale
  with no prop drilling, and [global-not-found.tsx](src/app/global-not-found.tsx)
  uses it. Root params reach neither route handlers nor Client Components, so
  `feed.xml` and the client components would keep what they use now, leaving two
  locale sources for one question. Its documented payoff is reading a root param
  inside a `'use cache'` function, which needs `cacheComponents`. Revisit then.
- **The language switcher navigates the document, not the router.** `[locale]` is
  a segment of the root layout, so switching it is a soft navigation that
  remounts that layout, and React re-applies `<html className>` over the `dark`
  class [theme.ts](src/lib/theme.ts)'s boot script added imperatively: the reader
  is dropped into light mode, and the same remount logs "Encountered a script tag
  while rendering React component" over the boot script itself. Plain anchors
  avoid both, the proxy writes `NEXT_LOCALE` on the document request, and
  [e2e/locale.spec.ts](e2e/locale.spec.ts) holds it shut. `next/script` is not the
  way out: `strategy="beforeInteractive"` still renders a `<script>`, and it
  defers execution to Next's runtime, which is after first paint and therefore a
  guaranteed flash.

## Where code goes

- Route-private components: `_components/` beside the route, now under `[locale]` (`src/app/[locale]/_components/`, `about/`, `blog/`, `blog/[slug]/`). Nothing enforces this, so follow it deliberately.
- Shared components: [src/components/](src/components/).
- shadcn primitives: [src/components/ui/](src/components/ui/). Generated; do not hand-edit.
- Tests: colocated as `*.test.ts(x)` next to their source.
- Aliases: `@/*` maps to `src/`, `@/content/*` maps to `content/`.

## Testing

**Every component test needs `// @vitest-environment jsdom` as its first line.**
Vitest runs `environment: "node"` globally, so without the docblock `render()`
fails with an error that does not name the cause.

**Import `render` from [src/test-utils.tsx](src/test-utils.tsx), not from
`@testing-library/react`.** It wraps the tree in `NextIntlClientProvider`, which
next-intl's `Link` and `usePathname` both read; without it they throw "No intl
context found". It re-exports everything else from Testing Library, so it is a
one-word change at the import.

`next-intl` is inlined in [vitest.config.ts](vitest.config.ts). It imports
`next/navigation` extensionless, which Node cannot resolve from pnpm's nested
layout, and the failure names a path inside `node_modules` rather than your test.

[vitest.setup.ts](vitest.setup.ts) installs `jsdom-testing-mocks`'
`mockIntersectionObserver`, which never fires on its own. Elements using motion's
`whileInView` therefore stay at their pre-entry state: assert that state, or call
`mockIntersectionObserver()` in your own test file and drive it with
`enterNode` / `leaveNode`, as
[blog-post-toc.test.tsx](src/app/[locale]/blog/[slug]/_components/blog-post-toc.test.tsx)
does. `act` is wired through `configMocks`, so those calls need no wrapping.

There is no equivalent for scroll. jsdom leaves `document.scrollingElement`
undefined and motion's `useScroll` degrades to a no-op without it, so a test that
scrolls passes while asserting nothing. No library fills that gap; test what a
scroll-driven component renders before it moves, and check the rest in a browser.

The coverage excludes in [vitest.config.ts](vitest.config.ts) are deliberate
(pages, layouts, loading and error boundaries, OG images, `ui/`, `decorative/`,
`mdx/`, diagram scenes, `test-utils`). Do not write tests purely to satisfy
coverage on those, and do not widen the list to avoid writing a real test. They
glob on `src/app/**` rather than exact paths **because the routes sit under
`[locale]`**: an exact path stops matching the moment a file moves, silently, and
drags uncovered code into the denominator against codecov's project threshold.

Tests query by role and accessible name (`getByRole`), not by test id. Keep it
that way: it is what makes the suite double as an accessibility check.

### End to end

Playwright, in [e2e/](e2e/). `pnpm e2e` builds and serves on :3100, so the suite
tests the artifact that deploys: drafts are served outside production, and a dev
server would hand it routes the deploy does not have. Adding a page means adding
a row to [e2e/routes.ts](e2e/routes.ts).

**Every route is tested under every locale.** The suite is dominated by its own
build, not by its assertions, so the product costs almost nothing. `STATIC_PAGES`
is that product, derived from a locale-less table with per-locale headings and
titles, all **spelt out**: importing them from `src/messages` would leave every
assertion vacuous, which is the same reason `TITLE_SUFFIX` is spelt out.
[e2e/locale.spec.ts](e2e/locale.spec.ts) covers what only the proxy does:
negotiation, the cookie beating the header, `Vary`, and the untranslated
fallback.

- **`e2e/**` is excluded in [vitest.config.ts](vitest.config.ts).** Vitest's
  default `include` claims `*.spec.ts` too, and a Playwright spec collected there
  fails on its `@playwright/test` import rather than on anything it asserts.
- Post slugs are read off disk **per locale**, not through `listSlugs`:
  [src/lib/blog.ts](src/lib/blog.ts) is `server-only` and throws on
  import outside a Server Component.
- **`locale` on a Playwright context reaches browser pages only.** The `request`
  fixture negotiates from no header at all, so the proxy tests set
  `extraHTTPHeaders: { "accept-language": ... }` instead. Using `locale` there
  looks right and silently tests the default.
- **Base UI's `Button` stamps `role="button"` on whatever it renders as**, so the
  header nav and the social buttons are `getByRole("button")` despite being
  anchors. Plain `next/link`, as in the footer and the byline, stays `link`.

The empty-console assertion is the one that earns the suite: it caught the 404
hydration mismatch that [use-mounted-pathname.ts](src/components/use-mounted-pathname.ts)
now holds shut.

**That assertion only works because of the barrier above it.** The `problems`
fixture waits for `<next-route-announcer>`, which Next builds from a `useEffect`
and so cannot exist before the client has taken over. Drop the wait and the
assertion reads the console before React has had the chance to complain, which
passes on a page that is broken.

`pnpm exec playwright test --grep 404` with `useMountedPathname` returning
`usePathname()` directly is how you check the barrier still bites: two tests
should fail on React #418.

`useMountedPathname` strips the locale itself rather than using next-intl's
`usePathname`, which strips only the locale its provider was given. The global
404 renders in whatever locale the request resolved to, and the crumb has to
survive that.

### Deliberate, and general Playwright advice will tell you otherwise

- **The `webServer` builds.** Every guide calls that an anti-pattern and reaches
  for `next dev`. Switching costs the suite its point, for the reason at the top
  of this section.
- **Chromium alone**, matched by [ci.yml](.github/workflows/ci.yml) installing
  only Chromium.
- **No Page Object Model.** Five files of loops over route tables have nothing
  to abstract.
- **No `workers: "50%"`.** Half the logical cores is already the default.

`@playwright/test` types are the source of truth over anything written about
Playwright, this file included: `npx playwright init` and
`expect.soft.hasFailures()` are both circulating and neither exists.

## Blog posts

MDX in `content/blog/<locale>/`, with the cover in
[content/blog/covers/](content/blog/covers/), shared across locales: a
photograph does not translate, only its `coverAlt` and `coverCaption` do.

- The `metadata` export must match `BlogPostMetadata` in [src/lib/blog.ts](src/lib/blog.ts). `cover` and `coverAlt` are **required**, not optional: the listing renders covers full-width, and a missing one reads as a broken row.
- New post: copy `_template.mdx` into a locale directory, rename it, and uncomment the two cover lines in the same edit. The template stays above the locale directories, and its cover lines stay commented, because the dynamic import compiles it too and it would fail on an image that does not exist.
- `.draft.mdx` files are gitignored and served at `/<locale>/blog/<slug>.draft` outside production only.
- `<Epilogue>` takes a `title`. It is the one MDX component whose copy cannot come from the request locale: on a post being served as a fallback the heading has to be the language the body is written in.
- [content/blog.test.ts](content/blog.test.ts) enforces descriptions at 160 characters or fewer, a titled epilogue, and one cover per slug across locales.

TypeScript cannot see into MDX, so that test is the only thing holding posts
to the shape. Getting it right up front is cheaper than a red CI run.

**A post exists in the locales that wrote it, and falls back into the others.**
`getBlogPosts(locale)` returns the union, each entry tagged with its
`contentLocale`, so an untranslated post is still listed and still reachable,
marked and wrapped in a notice. That page claims no canonical of its own and
points its alternates at the original, and the sitemap and feed carry a post
only under the locale that wrote it: listing a URL that canonicalises elsewhere
contradicts the canonical.

**Translated headings produce different anchors.** `rehype-slug` derives ids
from heading text, so a post's `#fragment`s differ per locale and its table of
contents does too. The language switcher drops the hash for that reason.

## Copy lives in one place

Translated copy lives in [src/messages/](src/messages/), per the Language
section above. [src/lib/site.ts](src/lib/site.ts) keeps only what does not
translate: `siteUrl`, `siteName`, `person` (identity alone: a name, a handle, a
portrait, an address, two profiles), `social`, `contactEmail`, `repoUrl`, `host`
(bar its address, which names a country), and `SECTION_PATHS`. Import it, never
retype it.

`tagline` was once five separate literals across five files and drifted the
first time it was reworded. The section names were four. Adding a surface means
adding an import or a key, not another copy.

**A prose string left in `site.ts` is French served to an English reader.** That
is how the English feed came to be described in French under `<language>en</language>`,
and the manifest with it: `tagline` stayed behind when the copy moved, and
nothing typed can see the difference. Metadata routes reach copy the same way
components do, through `getTranslations({ locale })` with the locale named
explicitly. Under Vitest that throws, because next-intl resolves to its
React-client build, so those tests mock it with
[server.mock.ts](src/i18n/server.mock.ts), which reads the real catalogue rather
than stubbing it.

## Comments

Default to none. Names, types and tests carry the meaning; a comment is a second
copy of the truth that goes stale on its own.

Write one only where a reader who already understands the code would still get it
wrong:

- A constraint that lives outside the file. `photo-lift` needs `group` and
  `overflow-hidden` on an ancestor.
- A line that looks removable and is not. `outline-ring/50` emits a colour with
  no width, so it draws nothing.

One line. If it needs a paragraph, the code needs the work instead. Not the
rationale for a choice, not history, not a number a reader can recompute, and
never a restatement of the line below it. Where a named constant would carry the
meaning, use the constant. A Tailwind class is not on its own a reason to
comment.

## Spacing

The ramp is `1, 2, 3, 4, 6, 8, 12`, and a step encodes how related two things are
rather than a pixel count. The anchors:

| Step | Used for |
| --- | --- |
| `gap-2` | inside one thing: an icon and its label, a row of tags |
| `gap-4` | an element and the rule or marker that introduces it |
| `gap-6` | blocks within a section |
| `gap-8`, `mt-12` | section to section |

[src/components/blog-post-summary.tsx](src/components/blog-post-summary.tsx) is the
worked example: `mt-2` from the date to the title, `mt-3` to the description,
`mt-4` to the tags, `mt-6` to the call to read. Four steps in one component,
widening as the relationship loosens. Pick a value by naming the relationship,
not by eye.

- **Spacing belongs to the container's `gap`, not to each child's margin.** One
  value that cannot drift beats six that can.
- **The page-level step is `16`, and it lives in `page-shell`** (`py-16 md:py-24`).
  The two `Empty` states reuse it directly so an empty page still breathes at page
  scale. Nothing else should reach for it.
- **Never an arbitrary value for spacing.** Every `-[…]` in the repo is a
  `clamp()`, an aspect ratio, a grid track or a `data-` selector. Keep it that
  way.
- **A repeated class string is where drift starts.** `panel` exists because three
  bordered surfaces carried `rounded-lg border border-border p-6 md:p-8` by hand.
  Custom utilities come first in the class list, as in `site-container flex`.
- **The skeletons copy the rhythm of the components they stand in for**, so
  changing a component's steps silently desynchronises its `loading.tsx`.

Nothing enforces any of this. Biome does not restrict class values, and pruning
steps out of `@theme` (`--spacing-5: initial`) would break the shadcn primitives
that use them.

## Prose and typography

- **No em dash or en dash anywhere, including titles, labels and code comments.** `·` separates a title or label from its context, as in `"%s · Geoffrey Migliacci"` and the byline. In prose use a colon, a comma, or parentheses, remembering that French takes a space before the colon and English does not. The vendored skills under `.agents/` are upstream copies and are left as they are, [.agents/NOTICE.md](.agents/NOTICE.md) excepted: it is ours, and follows this rule. The `nextjs-agent-rules` block at the top of this file is upstream too, and carries two em dashes: `next dev` rewrites it verbatim on every start, so editing them out only dirties the tree.
- Space Grotesk 700 for headings, Geist for body, JetBrains Mono for code. No serifs: two were tried and rejected.
- `@tailwindcss/typography` rules beat margin utilities inside `.prose`. MDX components rendered there need the important form (`my-0!`, `m-0!`, `p-0!`), as in [src/components/mdx/](src/components/mdx/).
- `@theme inline` bakes resolved values into the utilities that use them, so those tokens cannot be repointed at runtime. Theme switching goes through the `.dark` class and the CSS variables it overrides, never through reassigning a `@theme` token.
- Dark mode is opt-in via the `.dark` class set by the boot script in the layout. `prefers-color-scheme` is deliberately ignored so light is always the first impression.

## CI

[.github/workflows/ci.yml](.github/workflows/ci.yml) gates on lint, typecheck,
`test:coverage`, then build, with the Playwright smoke suite running alongside as
its own job, and only then deploys to Vercel on `main`. Break any of the five and
nothing ships.

Run `pnpm lint && pnpm typecheck && pnpm test` before handing work back.

## Git hooks

Husky, installed by the `prepare` script on every `pnpm install`. The hooks add
no guarantee CI does not already give: they shorten the feedback loop from a CI
round trip to seconds. The split follows what each check costs.

| Hook | Runs | Cost |
| --- | --- | --- |
| `pre-commit` | `biome check --staged` | under a second |
| `commit-msg` | `commitlint --edit` | instant |
| `pre-push` | `pnpm check` (lint, typecheck, test) | about 14s |

- **`build` and `e2e` are barred from hooks.** Not for their runtime: a build
  while `pnpm dev` holds :3000 corrupts Turbopack's CSS state, per the warning at
  the top of this file. `e2e` runs a build of its own. Both stay in CI.
- **No lint-staged.** Biome 2.5 has `--staged` natively, so it would be a
  dependency duplicating a flag already in the CLI.
- **`pre-commit` has no `--write`.** It prints the diff and aborts rather than
  fixing, because `--staged --write` can sweep unstaged hunks of a partially
  staged file into the commit. Run `pnpm format` and re-stage.
- **`pre-push` calls `pnpm check`** rather than restating the three commands, so
  the hook cannot drift from the line above.
- `content` is a custom `type-enum` entry in
  [commitlint.config.mjs](commitlint.config.mjs): `config-conventional` does not
  ship it, and the rule replaces the list rather than extending it, so the other
  eleven types are restated there. Inherited defaults that bind: a 100 character
  header, and a subject that is not sentence, start, pascal or upper case.
- `HUSKY: 0` at workflow level in [ci.yml](.github/workflows/ci.yml) keeps the
  hooks out of CI, which runs the same checks as explicit steps.

