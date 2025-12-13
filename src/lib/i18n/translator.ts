import { type AppLocale, type Dictionary, defaultLocale } from "./config";

function getPathSegments(key: string) {
  return key.split(".").filter(Boolean);
}

function lookup(dictionary: Dictionary, key: string): string {
  const segments = getPathSegments(key);
  let current: unknown = dictionary;

  for (const segment of segments) {
    if (current && typeof current === "object" && segment in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      throw new Error(`Missing translation key "${key}"`);
    }
  }

  if (typeof current !== "string") {
    throw new Error(`Translation for key "${key}" must be a string`);
  }

  return current;
}

export function createTranslator(dictionary: Dictionary) {
  return (key: string): string => lookup(dictionary, key);
}

export function getLanguageTag(locale: AppLocale = defaultLocale) {
  return locale === "en" ? "en-US" : "nb-NO";
}
