import type React from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { defaultLocale, isSupportedLocale, localeCookieName } from "@/lib/i18n/config";

export const metadata = {
  title: "Y-Link",
  description: "Y-Link - AI-driven DMX controller",
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
