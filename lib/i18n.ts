import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import ar from "@/messages/ar.json";

export type Locale = "en" | "fr" | "ar";

export const DEFAULT_LOCALE: Locale = "en";

const LOCALE_MESSAGES = { en, fr, ar } as const;

export type LocaleMessages = typeof en;

export function getLocaleFromPathname(pathname: string | null): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  return "en";
}

export function withLocalePrefix(locale: Locale, path: string): string {
  if (locale === "en") return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

export function getMessages(locale: Locale): LocaleMessages {
  return LOCALE_MESSAGES[locale];
}

export function translateCategory(locale: Locale, category: string): string {
  const messages = getMessages(locale);
  return messages.categories[category as keyof typeof messages.categories] ?? category;
}
