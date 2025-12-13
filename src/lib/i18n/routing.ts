import { defaultLocale, isSupportedLocale, type AppLocale } from "./config";

export function prefixLocale(locale: AppLocale, path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/" || cleanPath === "") {
    return `/${locale}`;
  }
  return `/${locale}${cleanPath}`;
}

export function stripLocaleFromPath(pathname: string): { locale: AppLocale; path: string } {
  const segments = pathname.split("/");
  const possibleLocale = segments[1];
  if (isSupportedLocale(possibleLocale)) {
    return {
      locale: possibleLocale,
      path: `/${segments.slice(2).join("/")}`.replace(/\/+/g, "/") || "/",
    };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
