import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.useCases.smallVenues.metadata.title,
    description: dictionary.useCases.smallVenues.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/use-cases/automated-dmx-small-venues"),
      languages: {
        "nb-NO": prefixLocale("nb", "/use-cases/automated-dmx-small-venues"),
        "en-US": prefixLocale("en", "/use-cases/automated-dmx-small-venues"),
      },
    },
  };
}

export default async function AutomatedSmallVenuesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { useCases, navigation } = dictionary;
  const page = useCases.smallVenues;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: useCases.breadcrumb, href: prefixLocale(locale, "/use-cases") },
              { label: page.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{page.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{page.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{page.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {page.features.map((item) => (
              <div key={item.title} className="rounded-lg border border-border/40 bg-card p-6">
                <h2 className="text-title mb-3 text-foreground">{item.title}</h2>
                <p className="text-body text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl rounded-lg border border-border/40 bg-card p-8">
            <h2 className="text-heading mb-6 text-foreground">{page.stepsTitle}</h2>
            <ol className="space-y-4 text-body text-muted-foreground">
              {page.steps.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 bg-accent text-sm font-semibold text-foreground">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              {page.cta.prefix}{" "}
              <Link href={prefixLocale(locale, "/ai-dmx-controller")} className="text-foreground underline underline-offset-4 hover:opacity-80">
                {page.cta.aiDmx}
              </Link>{" "}
              {page.cta.connector}{" "}
              <Link href={prefixLocale(locale, "/pilot")} className="text-foreground underline underline-offset-4 hover:opacity-80">
                {page.cta.pilot}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
