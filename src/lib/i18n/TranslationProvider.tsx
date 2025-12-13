"use client";

import { createContext, useContext, useMemo } from "react";
import { type AppLocale, type Dictionary, localeNames } from "./config";
import { createTranslator } from "./translator";

type TranslationContextValue = {
  locale: AppLocale;
  lang: string;
  dictionary: Dictionary;
  t: (key: string) => string;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({
  locale,
  dictionary,
  children,
}: {
  locale: AppLocale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<TranslationContextValue>(() => {
    const t = createTranslator(dictionary);
    return {
      locale,
      lang: localeNames[locale],
      dictionary,
      t,
    };
  }, [dictionary, locale]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslations() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslations must be used within TranslationProvider");
  return ctx;
}
