import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper"
import { Footer } from "@/components/Footer"
import { InterestSignupProvider } from "@/components/InterestSignupProvider"
import { Navbar } from "@/components/Navbar"
import { StructuredData } from "@/components/StructuredData"
import { defaultDescription, defaultOgImage, defaultTitle, organizationSchema, siteUrl, websiteSchema } from "@/lib/seo"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Y-Link",
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Y-Link",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Y-Link AI DMX Controller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nb" suppressHydrationWarning>
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
      <body>
        <StructuredData data={[organizationSchema, websiteSchema]} />
        <InterestSignupProvider>
          <div className="relative min-h-screen bg-background">
            <div className="grid-background absolute inset-0 opacity-30" />
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </InterestSignupProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
