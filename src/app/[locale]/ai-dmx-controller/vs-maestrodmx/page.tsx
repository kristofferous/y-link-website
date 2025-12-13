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
  const meta = dictionary.aiDmxVsMaestro.metadata;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: prefixLocale(locale, "/ai-dmx-controller/vs-maestrodmx"),
    },
  };
}

export default async function VsMaestroPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { aiDmxVsMaestro, aiDmx, navigation } = dictionary;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: aiDmx.breadcrumb, href: prefixLocale(locale, "/ai-dmx-controller") },
              { label: aiDmxVsMaestro.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{aiDmxVsMaestro.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{aiDmxVsMaestro.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{aiDmxVsMaestro.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-label font-semibold text-muted-foreground">Criterion</div>
                <div className="text-label font-semibold text-muted-foreground">Y-Link</div>
                <div className="text-label font-semibold text-muted-foreground">MaestroDMX</div>
                {aiDmxVsMaestro.comparison.map((row, index) => (
                  <div key={`${row.label}-${index}`} className="contents">
                    <div className="rounded-lg bg-accent p-4 text-sm font-semibold text-foreground">{row.label}</div>
                    <div className="rounded-lg border border-border/40 bg-background p-4 text-sm text-muted-foreground">
                      {row.ylink}
                    </div>
                    <div className="rounded-lg border border-border/40 bg-background p-4 text-sm text-muted-foreground">
                      {row.maestro}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                {aiDmxVsMaestro.cta.prefix}{" "}
                <Link
                  href={prefixLocale(locale, "/ai-dmx-controller")}
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {aiDmxVsMaestro.cta.link}
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
