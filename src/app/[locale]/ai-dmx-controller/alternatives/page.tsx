import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PageProps = { params: { locale: AppLocale } };

type PageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const meta = dictionary.aiDmxAlternatives.metadata;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: prefixLocale(locale, "/ai-dmx-controller/alternatives"),
    },
  };
}

export default async function AlternativesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { aiDmxAlternatives, aiDmx } = dictionary;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: aiDmx.breadcrumb, href: prefixLocale(locale, "/ai-dmx-controller") },
              { label: aiDmxAlternatives.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{aiDmxAlternatives.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{aiDmxAlternatives.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{aiDmxAlternatives.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {aiDmxAlternatives.options.map((opt) => (
              <div key={opt.name} className="rounded-lg border border-border/40 bg-card p-6 space-y-3">
                <p className="text-title text-foreground">{opt.name}</p>
                <p className="text-body text-muted-foreground">{opt.focus}</p>
                <p className="text-label text-muted-foreground">{opt.bestFor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl rounded-lg border border-border/40 bg-card p-8">
            <h2 className="text-heading mb-6 text-foreground">{aiDmxAlternatives.consider.title}</h2>
            <ul className="space-y-3 text-body text-muted-foreground">
              {aiDmxAlternatives.consider.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              <Link
                href={prefixLocale(locale, "/ai-dmx-controller/vs-maestrodmx")}
                className="text-foreground underline underline-offset-4 hover:opacity-80"
              >
                {aiDmxAlternatives.consider.linkLabel}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
