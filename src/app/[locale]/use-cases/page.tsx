import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type UseCasesPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: UseCasesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.useCases.metadata.title,
    description: dictionary.useCases.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/use-cases"),
      languages: {
        "nb-NO": prefixLocale("nb", "/use-cases"),
        "en-US": prefixLocale("en", "/use-cases"),
      },
    },
  };
}

export default async function UseCasesPage({ params }: UseCasesPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { useCases, navigation } = dictionary;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: useCases.breadcrumb, href: prefixLocale(locale, "/use-cases") },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{useCases.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{useCases.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{useCases.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-3">
            {useCases.cards.map((item) => (
              <Link
                key={item.href}
                href={prefixLocale(locale, item.href)}
                className="group rounded-lg border border-border/40 bg-card p-6 transition-colors hover:bg-accent"
              >
                <h2 className="text-title mb-3 text-foreground">{item.title}</h2>
                <p className="text-body mb-4 text-muted-foreground">{item.detail}</p>
                <span className="text-label text-muted-foreground group-hover:text-foreground">{useCases.readMore}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
