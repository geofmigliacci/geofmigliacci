import type { Locale } from "@/i18n/locales";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

const CATALOGUES: Record<Locale, typeof en> = { en, fr };

type Namespace = keyof typeof en;

/** Reach it as `vi.mock("next-intl/server", () => import("@/i18n/server.mock"))`. */
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
