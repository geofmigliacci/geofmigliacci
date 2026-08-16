import type { routing } from "@/i18n/routing";
import type en from "@/messages/en.json";

declare global {
  /** English is structurally the source of truth: a key it lacks does not typecheck. */
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
