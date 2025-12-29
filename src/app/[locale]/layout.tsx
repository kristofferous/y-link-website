import type React from "react";
import type { Metadata } from "next";
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper";
import { Footer } from "@/components/Footer";
import { InterestSignupProvider } from "@/components/InterestSignupProvider";
import { Navbar } from "@/components/Navbar";
import { StructuredData } from "@/components/StructuredData";
import { TranslationProvider } from "@/lib/i18n/TranslationProvider";
import { getDictionary, localeNames, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { getLanguageTag } from "@/lib/i18n/translator";
import { defaultOgImage, organizationSchema, siteUrl, websiteSchema } from "@/lib/seo";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  const dictionary = await getDictionary(locale);
  const lang = localeNames[locale];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dictionary.meta.title,
      template: "%s | Y-Link",
    },
    description: dictionary.meta.description,
    openGraph: {
      type: "website",
      siteName: dictionary.meta.siteName ?? "Y-Link",
      url: siteUrl,
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      locale: lang,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: dictionary.meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      images: [defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  const dictionary = await getDictionary(locale);
  const lang = getLanguageTag(locale);

  return (
    <TranslationProvider locale={locale} dictionary={dictionary}>
      <StructuredData data={[organizationSchema(lang), websiteSchema(lang)]} />
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
    </TranslationProvider>
  );
}
