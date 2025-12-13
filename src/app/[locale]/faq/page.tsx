import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

type FAQPageProps = {
  params: { locale: AppLocale };
};

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.faq.metadata.title,
    description: dictionary.faq.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/faq"),
    },
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const locale = normalizeLocale(params.locale);
  const dictionary = await getDictionary(locale);
  const { faq, navigation } = dictionary;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: absoluteUrl(prefixLocale(locale, "/faq")),
  };

  return (
    <main>
      <StructuredData data={faqSchema} />
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: faq.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{faq.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{faq.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{faq.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-4 md:grid-cols-2">
            {faq.items.map((item) => (
              <div key={item.q} className="rounded-lg border border-border/40 bg-card p-6">
                <h2 className="text-title mb-3 text-foreground">{item.q}</h2>
                <p className="text-body text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
