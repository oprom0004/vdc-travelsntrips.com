import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

export type Locale = "en" | "fr";

export const DEFAULT_LOCALE: Locale = "en";

const LOCALE_MESSAGES = { en, fr } as const;

export type LocaleMessages = typeof en;

export function getLocaleFromPathname(pathname: string | null): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

export function withLocalePrefix(locale: Locale, path: string): string {
  if (locale === "en") return path;
  if (path === "/") return "/fr";
  return `/fr${path}`;
}

export function getMessages(locale: Locale): LocaleMessages {
  return LOCALE_MESSAGES[locale];
}

export function translateCategory(locale: Locale, category: string): string {
  const messages = getMessages(locale);
  return messages.categories[category as keyof typeof messages.categories] ?? category;
}