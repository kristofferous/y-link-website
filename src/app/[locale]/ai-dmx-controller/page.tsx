import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type AIDMXPageProps = {
  params: { locale: AppLocale };
};

export async function generateMetadata({ params }: AIDMXPageProps): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.aiDmx.metadata.title,
    description: dictionary.aiDmx.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/ai-dmx-controller"),
    },
  };
}

export default async function AIDMXControllerPage({ params }: AIDMXPageProps) {
  const locale = normalizeLocale(params.locale);
  const dictionary = await getDictionary(locale);
  const { aiDmx, navigation } = dictionary;

  return (
    <main>
      {/* Header Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: aiDmx.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{aiDmx.hero.label}</p>
            <h1 className="text-display text-foreground">
              {aiDmx.hero.title}
              <br />
              <span className="text-muted-foreground">{aiDmx.hero.subtitle}</span>
            </h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{aiDmx.hero.body}</p>
            <div className="flex flex-wrap gap-3">
              {aiDmx.hero.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mb-12 flex items-center gap-4">
            <h2 className="text-heading text-foreground">{aiDmx.how.title}</h2>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {aiDmx.how.steps.map((item) => (
              <div key={item.title} className="rounded-lg border border-border/40 bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-background font-mono text-sm font-semibold text-foreground">
                  {item.step}
                </div>
                <h3 className="text-title mb-2 text-foreground">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-heading text-foreground">{aiDmx.who.title}</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                {aiDmx.who.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                <Link
                  href={prefixLocale(locale, "/use-cases/music-reactive-dmx-clubs")}
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {aiDmx.who.club}
                </Link>{" "}
                /{" "}
                <Link
                  href={prefixLocale(locale, "/use-cases/automated-dmx-small-venues")}
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {aiDmx.who.smallVenue}
                </Link>
                .
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-6">
              <h3 className="text-title mb-4 text-foreground">{aiDmx.setup.title}</h3>
              <ul className="space-y-3 text-body text-muted-foreground">
                {aiDmx.setup.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                      <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">{aiDmx.setup.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-xl border border-border/40 bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-heading text-foreground">{aiDmx.cta.title}</h2>
              <p className="text-body text-muted-foreground">{aiDmx.cta.body}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={prefixLocale(locale, "/pilot")}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {aiDmx.cta.primary}
                </Link>
                <Link
                  href={prefixLocale(locale, "/guides/dmx-latency-jitter")}
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {aiDmx.cta.secondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
