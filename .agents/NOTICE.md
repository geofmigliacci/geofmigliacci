# Third-party notices

The skills under `.agents/skills/` are copies of other people's work, tracked in
git and therefore redistributed by this repository. All but one are MIT licensed,
`playwright-cli` is Apache-2.0, and both licenses require the copyright notice
travel with the copy. This file is that notice.

Unlike every other file under `.agents/`, this one is not an upstream copy: it is
maintained here, and follows the repository's own conventions.

**Keep it in step with [skills-lock.json](../skills-lock.json).** Adding or
removing a skill means adding or removing a row below. The row count must equal
the number of entries in that file, currently 15.

## Skills

| Skill | Upstream | License |
| --- | --- | --- |
| `accessibility` | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | MIT |
| `code-review-and-quality` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | MIT |
| `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT |
| `next-best-practices` | [vercel-labs/openreview](https://github.com/vercel-labs/openreview) | MIT, stated in README only |
| `next-cache-components` | [vercel-labs/openreview](https://github.com/vercel-labs/openreview) | MIT, stated in README only |
| `next-upgrade` | [vercel-labs/openreview](https://github.com/vercel-labs/openreview) | MIT, stated in README only |
| `performance` | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | MIT |
| `playwright-cli` | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) | Apache-2.0 |
| `seo` | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | MIT |
| `shadcn` | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | MIT |
| `tailwind-css-patterns` | [giuseppe-trisciuoglio/developer-kit](https://github.com/giuseppe-trisciuoglio/developer-kit) | MIT |
| `vercel-composition-patterns` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT, stated in README only |
| `vercel-react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT, stated in README only |
| `vitest` | [antfu/skills](https://github.com/antfu/skills) | MIT |
| `web-quality-audit` | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | MIT |

`skills-lock.json` records the `shadcn` source as `shadcn/ui`, which is the
registry name. The repository is `shadcn-ui/ui`.

## Copyright notices

Verified against each upstream `LICENSE` on 6 August 2026, and `playwright-cli`
on 7 August 2026.

```
Copyright (c) 2026 Addy Osmani                                    web-quality-skills
Copyright (c) 2025 Addy Osmani                                    agent-skills
Copyright (c) 2026 Leonxlnx                                       taste-skill
Copyright (c) Microsoft Corporation.                              playwright-cli
Copyright (c) 2023 shadcn                                         shadcn-ui/ui
Copyright (c) 2025 Giuseppe Trisciuoglio                          developer-kit
Copyright (c) 2025-PRESENT Anthony Fu <https://github.com/antfu>  antfu/skills
```

`vercel-labs/openreview` and `vercel-labs/agent-skills` declare MIT in their
README but ship no `LICENSE` file, so GitHub detects no license for either and
there is no copyright line to reproduce. Both were public and in that state when
checked. If either later adds a `LICENSE`, copy its notice here.

## Apache License 2.0

Applies to `playwright-cli` alone. Apache-2.0 asks that a copy of the license
travel with the copy of the work, so the upstream text is vendored verbatim at
[skills/playwright-cli/LICENSE](skills/playwright-cli/LICENSE). `npx skills
update` rewrites that directory from upstream, which ships no `LICENSE` inside
the skill folder: restore the file if an update drops it. Upstream carries no
`NOTICE` file, so there is none to reproduce here.

## MIT License

Applies to every skill listed above except `playwright-cli`, with copyright held
by the respective holders named in this file.

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
