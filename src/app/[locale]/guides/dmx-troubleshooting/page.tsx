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
  const meta = dictionary.guides.dmxTroubleshooting.metadata;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: prefixLocale(locale, "/guides/dmx-troubleshooting"),
    },
  };
}

export default async function DMXTroubleshootingPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { guides, navigation } = dictionary;
  const page = guides.dmxTroubleshooting;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: guides.breadcrumb, href: prefixLocale(locale, "/guides") },
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
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">{page.errors.title}</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {page.errors.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">{page.checklist.title}</h2>
              <ol className="space-y-3 text-body text-muted-foreground">
                {page.checklist.items.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 bg-accent text-sm font-semibold text-foreground">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                <Link
                  href={prefixLocale(locale, "/guides/dmx-basics")}
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {page.checklist.linkLabel}
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
