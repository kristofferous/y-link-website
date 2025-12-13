import { default as en } from "@/locales/en-US.json";
import { default as nb } from "@/locales/nb-NO.json";

export const locales = ["nb", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const localeNames: Record<AppLocale, string> = {
  nb: "nb-NO",
  en: "en-US",
};

export const localeLabels: Record<AppLocale, string> = {
  nb: "Norsk (nb-NO)",
  en: "English (en-US)",
};

export const defaultLocale: AppLocale = "nb";
export const localeCookieName = "preferred_locale";

export type Dictionary = typeof en;

const dictionaries: Record<AppLocale, Dictionary> = {
  nb,
  en,
};

export function isSupportedLocale(value: string | undefined | null): value is AppLocale {
  if (!value) return false;
  return locales.includes(value.toLowerCase() as AppLocale);
}

export function normalizeLocale(value: string | undefined | null): AppLocale {
  if (!value) return defaultLocale;
  const lower = value.toLowerCase();
  return isSupportedLocale(lower) ? (lower as AppLocale) : defaultLocale;
}

export async function getDictionary(locale: AppLocale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
