"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { localeCookieName, localeLabels, locales, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale, stripLocaleFromPath } from "@/lib/i18n/routing";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale } = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [pendingLocale, setPendingLocale] = useState<AppLocale | null>(null);

  const currentPath = useMemo(() => stripLocaleFromPath(pathname ?? "/").path, [pathname]);

  useEffect(() => {
    if (!pendingLocale) return;
    const target = prefixLocale(pendingLocale, currentPath);
    document.cookie = `${localeCookieName}=${pendingLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    try {
      localStorage.setItem(localeCookieName, pendingLocale);
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("lang", pendingLocale === "en" ? "en-US" : "nb-NO");
    router.push(target);
  }, [pendingLocale, currentPath, router]);

  const handleChange = (nextLocale: AppLocale) => {
    setPendingLocale(nextLocale);
  };

  return (
    <div className={clsx("flex items-center gap-2 text-sm", className)}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChange(code)}
          className={clsx(
            "rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
            locale === code
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
          )}
          aria-pressed={locale === code}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}
