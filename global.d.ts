import type { routing } from "@/i18n/routing";
import type en from "@/messages/en.json";

/** `declare module`, not `declare global`: next-intl reads its own `AppConfig`, and a global one of that name types nothing. */
declare module "next-intl" {
  /** English is structurally the source of truth: a key it lacks does not typecheck. */
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
