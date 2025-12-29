import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";

type TechnicalPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: TechnicalPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.technical.metadata.title,
    description: dictionary.technical.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/teknisk"),
      languages: {
        "nb-NO": prefixLocale("nb", "/teknisk"),
        "en-US": prefixLocale("en", "/teknisk"),
      },
    },
  };
}

export default async function TechnicalPage({ params }: TechnicalPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { technical, navigation } = dictionary;
  const breadcrumbs = [
    { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
    { label: technical.breadcrumb },
  ];

  const techSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: technical.metadata.title,
    about: technical.hero.title,
    url: absoluteUrl(prefixLocale(locale, "/teknisk")),
    inLanguage: locale === "en" ? "en" : "nb",
    author: {
      "@type": "Organization",
      name: "Y-Link",
      url: absoluteUrl(prefixLocale(locale, "/")),
    },
    keywords: ["AI DMX controller", "music reactive lighting", "DMX latency", "DMX stability"],
  };

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <main>
      <StructuredData data={[techSchema, breadcrumbSchema]} />
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{technical.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{technical.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{technical.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-6 text-foreground">{technical.pipeline.title}</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                {technical.pipeline.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-6 text-foreground">{technical.safety.title}</h2>
              <p className="text-body mb-4 text-muted-foreground">{technical.safety.body}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={prefixLocale(locale, "/guides/dmx-latency-jitter")}
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {technical.safety.latencyGuide}
                </Link>
                <Link
                  href={prefixLocale(locale, "/pilot")}
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {technical.safety.pilot}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
