export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];
