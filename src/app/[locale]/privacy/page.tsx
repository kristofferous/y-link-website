import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PrivacyPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.privacy.metadata.title,
    description: dictionary.privacy.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/privacy"),
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { privacy, navigation } = dictionary;

  return (
    <PageShell className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
          { label: privacy.breadcrumb },
        ]}
      />
      <SectionCard>
        <header className="space-y-3">
          <p className="text-label text-muted-foreground">{privacy.hero.label}</p>
          <h1 className="text-heading text-foreground">{privacy.hero.title}</h1>
        </header>

        <div className="mt-8 space-y-6 text-body text-muted-foreground">
          {privacy.body.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            {privacy.body[2].split("hello@y-link.no")[0]}
            <a href={`mailto:${privacy.email}`} className="text-foreground underline underline-offset-4 hover:opacity-80">
              {privacy.email}
            </a>
            {privacy.body[2].includes("hello@y-link.no") ? privacy.body[2].split("hello@y-link.no")[1] : "."}
          </p>
        </div>
      </SectionCard>
    </PageShell>
  );
}
