import type { Messages } from "next-intl";

/**
 * The namespaces a Client Component reads. Anything omitted stays on the
 * server: `NextIntlClientProvider` forwards the whole catalogue otherwise, and
 * the two legal pages are most of it while rendering server side only.
 */
const CLIENT_NAMESPACES = [
  "nav",
  "common",
  "site",
  "home",
  "about",
  "blog",
  "errors",
] as const satisfies readonly (keyof Messages)[];

export function clientMessages(messages: Messages) {
  return Object.fromEntries(
    CLIENT_NAMESPACES.map((namespace) => [namespace, messages[namespace]]),
  ) as Pick<Messages, (typeof CLIENT_NAMESPACES)[number]>;
}
