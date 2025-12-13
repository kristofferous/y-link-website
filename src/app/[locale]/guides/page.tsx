import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type GuidesPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: GuidesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.guides.metadata.title,
    description: dictionary.guides.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/guides"),
    },
  };
}

export default async function GuidesPage({ params }: GuidesPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { guides, navigation } = dictionary;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: guides.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{guides.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{guides.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{guides.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.list.map((guide) => (
              <Link
                key={guide.href}
                href={prefixLocale(locale, guide.href)}
                className="group flex items-center justify-between rounded-lg border border-border/40 bg-card p-5 transition-colors hover:bg-accent"
              >
                <span className="text-body font-medium text-foreground">{guide.title}</span>
                <svg
                  className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
