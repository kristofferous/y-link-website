import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { InterestSignupProvider } from "@/components/InterestSignupProvider";
import { Navbar } from "@/components/Navbar";
import { StructuredData } from "@/components/StructuredData";
import {
  defaultDescription,
  defaultOgImage,
  defaultTitle,
  organizationSchema,
  siteUrl,
  websiteSchema,
} from "@/lib/seo";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="antialiased text-neutral-900">
        <StructuredData data={[organizationSchema, websiteSchema]} />
        <InterestSignupProvider>
          <div className="relative min-h-screen overflow-hidden bg-white bg-[radial-gradient(circle_at_20%_10%,#e9edf7_0,#e9edf7_30%,transparent_45%),radial-gradient(circle_at_80%_0%,#eef0ff_0,#eef0ff_25%,transparent_45%),radial-gradient(circle_at_50%_90%,#f1f5fb_0,#f1f5fb_25%,transparent_45%)]">
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </InterestSignupProvider>
      </body>
    </html>
  );
}
