import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for supported locales.
 *
 * To add a new language you must update THREE places that have to stay in sync:
 *   1. The `locales` array below.
 *   2. The static imports + `messagesMap` in `src/i18n/request.ts`.
 *   3. The matching JSON file in `src/locales/<locale>.json`.
 */
export const routing = defineRouting({
  locales: ["en", "es", "pt", "de"],
  defaultLocale: "en",
  // English is served without a `/en` prefix (e.g. `/bosses`, `/bosses/gelum`).
  localePrefix: "as-needed",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
