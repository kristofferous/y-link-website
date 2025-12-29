import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { StructuredData } from "@/components/StructuredData";
import { faqAnswerText, fetchFaqItems } from "@/lib/faq";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

type FAQPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.faq.metadata.title,
    description: dictionary.faq.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/faq"),
      languages: {
        "nb-NO": prefixLocale("nb", "/faq"),
        "en-US": prefixLocale("en", "/faq"),
      },
    },
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { faq, navigation } = dictionary;
  const items = await fetchFaqItems(locale);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerText(item.answerHtml),
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
          <FaqList
            items={items}
            searchLabel={faq.search?.label ?? "Search"}
            searchPlaceholder={faq.search?.placeholder ?? "Search FAQs"}
            emptyLabel={faq.search?.empty ?? "No matching FAQs."}
          />
        </div>
      </section>
    </main>
  );
}
