import type React from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { defaultLocale, isSupportedLocale, localeCookieName } from "@/lib/i18n/config";

export const metadata = {
  title: "Y-Link",
  description: "Y-Link - autonomous AI DMX controller for room-aware lighting",
  icons: {
    icon: [
      { url: "/LogoVariants/16x16Y-Logo-Circle.png", sizes: "16x16", type: "image/png" },
      { url: "/LogoVariants/32x32Y-Logo-Circle.png", sizes: "32x32", type: "image/png" },
      { url: "/LogoVariants/96x96Y-Logo-Circle.png", sizes: "96x96", type: "image/png" },
      { url: "/LogoVariants/Y-Logo-Circle.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/LogoVariants/192x192Y-Logo-Circle.png", sizes: "192x192", type: "image/png" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isSupportedLocale(storedLocale) ? storedLocale : defaultLocale;
  const lang = locale === "en" ? "en-US" : "nb-NO";

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
