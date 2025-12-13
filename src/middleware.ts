import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, isSupportedLocale, localeCookieName, normalizeLocale, type AppLocale } from "./lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

function resolvePreferredLocale(request: NextRequest): AppLocale {
  const stored = request.cookies.get(localeCookieName)?.value;
  if (stored && isSupportedLocale(stored)) return stored;

  const header = request.headers.get("accept-language");
  if (header) {
    const primary = header.split(",")[0];
    if (primary) {
      if (primary.toLowerCase().startsWith("en")) return "en";
      if (primary.toLowerCase().startsWith("nb") || primary.toLowerCase().startsWith("no")) return "nb";
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/og-") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathLocale = pathname.split("/")[1];
  if (isSupportedLocale(pathLocale)) {
    return NextResponse.next();
  }

  const locale = resolvePreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(localeCookieName, normalizeLocale(locale), { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/((?!static|.*\\..*|_next).*)"],
};
