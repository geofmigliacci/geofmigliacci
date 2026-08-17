import type { Locale } from "@/i18n/locales";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

const CATALOGUES: Record<Locale, typeof en> = { en, fr };

type Namespace = keyof typeof en;

type MessageNode = string | { [key: string]: MessageNode };

const resolve = (scope: MessageNode, key: string) => {
  const value = key
    .split(".")
    .reduce<MessageNode | undefined>(
      (node, part) => (typeof node === "object" ? node[part] : undefined),
      scope,
    );

  return typeof value === "string" ? value : key;
};

/** Identity upstream too: the real one exists only to type the callback. */
export const getRequestConfig = <T>(config: T) => config;

/** Reach it as `vi.mock("next-intl/server", () => import("@/i18n/server.mock"))`. */
export const getTranslations = async ({
  locale = "en",
  namespace,
}: {
  locale?: Locale;
  namespace: Namespace;
}) => {
  const scope = CATALOGUES[locale][namespace] as MessageNode;
  return (key: string) => resolve(scope, key);
};
