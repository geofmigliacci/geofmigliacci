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
| `pnpm typecheck` | `tsc --noEmit` |
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
- **React 19.2**. Server Components by default; 20 files opt into `"use client"`.
- **Tailwind v4**, CSS-first. There is no `tailwind.config.js` and adding one is wrong. Tokens live in `@theme` / `@theme inline` in [src/app/globals.css](src/app/globals.css).
- **Biome 2.5**, not ESLint and not Prettier.
- **Vitest 4**, not Jest.
- **shadcn/ui** on the `base-nova` style over **Base UI** (`@base-ui/react`), not Radix. Config in [components.json](components.json).
- The animation package is **`motion`**, imported from `motion/react`. Not `framer-motion`.

## Language

UI copy and blog prose are **French** (`lang="fr"`, `locale: fr_FR`).
Identifiers and code comments are **English**. Authoring comments inside
`content/blog/` are French.

This is the easiest thing to break silently: an English button label fails no
test and breaks no build, it just makes the site read wrong.

## Where code goes

- Route-private components: `_components/` beside the route (four of these exist: `src/app/_components/`, `about/`, `blog/`, `blog/[slug]/`). Nothing enforces this, so follow it deliberately.
- Shared components: [src/components/](src/components/).
- shadcn primitives: [src/components/ui/](src/components/ui/). Generated; do not hand-edit.
- Tests: colocated as `*.test.ts(x)` next to their source.
- Aliases: `@/*` maps to `src/`, `@/content/*` maps to `content/`.

## Testing

**Every component test needs `// @vitest-environment jsdom` as its first line.**
Vitest runs `environment: "node"` globally, so without the docblock `render()`
fails with an error that does not name the cause. 21 test files carry it.

[vitest.setup.ts](vitest.setup.ts) installs `jsdom-testing-mocks`'
`mockIntersectionObserver`, which never fires on its own. Elements using motion's
`whileInView` therefore stay at their pre-entry state: assert that state, or call
`mockIntersectionObserver()` in your own test file and drive it with
`enterNode` / `leaveNode`, as
[blog-post-toc.test.tsx](src/app/blog/[slug]/_components/blog-post-toc.test.tsx)
does. `act` is wired through `configMocks`, so those calls need no wrapping.

There is no equivalent for scroll. jsdom leaves `document.scrollingElement`
undefined and motion's `useScroll` degrades to a no-op without it, so a test that
scrolls passes while asserting nothing. No library fills that gap; test what a
scroll-driven component renders before it moves, and check the rest in a browser.

The coverage excludes in [vitest.config.ts](vitest.config.ts) are deliberate
(pages, loading and error boundaries, OG images, `ui/`, `decorative/`, `mdx/`,
diagram scenes). Do not write tests purely to satisfy coverage on those, and do
not widen the list to avoid writing a real test.

Tests query by role and accessible name (`getByRole`), not by test id. Keep it
that way: it is what makes the suite double as an accessibility check.

### End to end

Playwright, in [e2e/](e2e/). `pnpm e2e` builds and serves on :3100, so the suite
tests the artifact that deploys: drafts are served outside production, and a dev
server would hand it routes the deploy does not have. Adding a page means adding
a row to [e2e/routes.ts](e2e/routes.ts).

- **`e2e/**` is excluded in [vitest.config.ts](vitest.config.ts).** Vitest's
  default `include` claims `*.spec.ts` too, and a Playwright spec collected there
  fails on its `@playwright/test` import rather than on anything it asserts.
- Post slugs are read off disk, not through `listSlugs`:
  [src/lib/blog.ts](src/lib/blog.ts) is `server-only` and throws on
  import outside a Server Component.
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

MDX in [content/blog/](content/blog/), with the cover image beside the
`.mdx` file.

- The `metadata` export must match `BlogPostMetadata` in [src/lib/blog.ts](src/lib/blog.ts). `cover` and `coverAlt` are **required**, not optional: the listing renders covers full-width, and a missing one reads as a broken row.
- New post: copy `_template.mdx`, rename it, and uncomment the two cover lines in the same edit. The template's cover lines stay commented because the dynamic import compiles the template too, and it would fail on an image that does not exist.
- `.draft.mdx` files are gitignored and served at `/blog/<slug>.draft` outside production only.
- [content/blog.test.ts](content/blog.test.ts) enforces descriptions at 160 characters or fewer.

TypeScript cannot see into MDX, so that test is the only thing holding posts
to the shape. Getting it right up front is cheaper than a red CI run.

## Copy lives in one place

Any string appearing on more than one surface belongs in
[src/lib/site.ts](src/lib/site.ts): `tagline`, `pitch`, `person`, `social`,
`host`, `contactEmail`. Import it, never retype it.

`tagline` was once five separate literals across five files and drifted the
first time it was reworded. Adding a sixth surface means adding an import, not
a sixth copy.

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

