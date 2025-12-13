import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InterestCtaButton } from "@/components/InterestCtaButton";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PilotPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PilotPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.pilot.metadata.title,
    description: dictionary.pilot.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/pilot"),
    },
  };
}

export default async function PilotPage({ params }: PilotPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { pilot, navigation } = dictionary;

  return (
    <main>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: pilot.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-accent px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-label text-muted-foreground">{pilot.hero.badge}</span>
            </div>
            <h1 className="text-display text-foreground">
              {pilot.hero.title}
              <br />
              <span className="text-muted-foreground">{pilot.hero.subtitle}</span>
            </h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{pilot.hero.body}</p>
            <InterestCtaButton
              context="pilot-hero"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {pilot.hero.cta}
            </InterestCtaButton>
          </div>
        </div>
      </section>

      {/* What It Is / What It Isn't */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-6 text-foreground">{pilot.whatIs.title}</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                {pilot.whatIs.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-accent p-8">
              <h2 className="text-heading mb-6 text-foreground">{pilot.whatNot.title}</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                {pilot.whatNot.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Partners Get / What We Expect */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-heading text-foreground">{pilot.partnersGet.title}</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {pilot.partnersGet.items.map((item) => (
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
            </div>

            <div className="space-y-6">
              <h2 className="text-heading text-foreground">{pilot.expectations.title}</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {pilot.expectations.items.map((item) => (
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
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-xl border border-border/40 bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-heading text-foreground">{pilot.cta.title}</h2>
              <p className="text-body text-muted-foreground">{pilot.cta.body}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <InterestCtaButton
                  context="pilot-footer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {pilot.cta.primary}
                </InterestCtaButton>
                <Link
                  href={prefixLocale(locale, "/ai-dmx-controller")}
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {pilot.cta.secondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
