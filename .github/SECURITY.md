# Security policy

## What this project is

`geofmigliacci.dev` is a statically rendered personal site. There are no user
accounts, no login, no database, no API that accepts input, and no third-party
scripts. The only thing written to a visitor's browser is a single `localStorage`
key holding the theme preference, described in the
[privacy policy](https://www.geofmigliacci.dev/privacy-policy).

That rules out most of the categories a report usually falls into. What is still
worth reporting: a dependency advisory that actually reaches this code, a
misconfigured security header, something exploitable in the build or deploy
pipeline, or content injection through the MDX post pipeline.

## Reporting

Email <geoffrey.migliacci@gmail.com>, or open a
[private security advisory](https://github.com/geofmigliacci/geofmigliacci.dev/security/advisories/new)
if you would rather keep it on GitHub. Please do not open a public issue for
something exploitable.

Include enough to reproduce it: the URL or file, what you did, what happened.

## What to expect

This is a personal project maintained in spare time, so no guaranteed response
window. Realistically you will hear back within a week. There is no bounty.

If you report something real, you get credit in the fix commit unless you would
rather not.

## Supported versions

Only what is deployed at `www.geofmigliacci.dev`, built from `main`. Older commits
are history, not releases, and are not patched.
