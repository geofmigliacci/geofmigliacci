import type { Locale } from "@/i18n/locales";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

const CATALOGUES: Record<Locale, typeof en> = { en, fr };

type Namespace = keyof typeof en;

/**
 * Vitest resolves next-intl to its React-client build, where every
 * `next-intl/server` export throws on call. This stands in for `getTranslations`
 * and reads the real catalogue, so an assertion against a message still bites.
 *
 * Reach it as `vi.mock("next-intl/server", () => import("@/i18n/server.mock"))`.
 */
export const getTranslations = async <N extends Namespace>({
  locale = "en",
  namespace,
}: {
  locale?: Locale;
  namespace: N;
}) => {
  const scope = CATALOGUES[locale][namespace];
  return (key: keyof typeof scope) => scope[key];
};
