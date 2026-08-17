import type { Messages } from "next-intl";

/** `NextIntlClientProvider` forwards the whole catalogue unless it is given a subset. */
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
