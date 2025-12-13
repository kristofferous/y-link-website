import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InterestCtaButton } from "@/components/InterestCtaButton";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type AboutPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.about.metadata.title,
    description: dictionary.about.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/om"),
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { about, actions, navigation } = dictionary;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: about.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{about.hero.label}</p>
            <h1 className="text-display text-foreground">
              {about.hero.title}
              <br />
              <span className="text-muted-foreground">{about.hero.subtitle}</span>
            </h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{about.hero.body}</p>
            <div className="flex flex-wrap items-center gap-4">
              <InterestCtaButton
                context="about-hero"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {actions.expressInterest}
              </InterestCtaButton>
              <a
                href="#how"
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
              >
                {about.hero.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Y-Link */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-lg border border-border/40 bg-card p-8 md:p-12">
            <h2 className="text-heading mb-6 text-foreground">{about.why.title}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {about.why.points.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <p className="text-body text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{about.why.note}</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing border-t border-border/40" id="how">
        <div className="container-custom">
          <h2 className="text-heading mb-8 text-foreground">{about.how.title}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {about.how.steps.map((item) => (
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
          <h2 className="text-heading mb-8 text-foreground">{about.who.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {about.who.audiences.map((item) => (
              <div key={item} className="rounded-lg border border-border/40 bg-card px-5 py-4">
                <p className="text-body font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {about.who.ctaPrefix}{" "}
            <Link
              href={prefixLocale(locale, "/use-cases")}
              className="text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {about.who.ctaUseCases}
            </Link>{" "}
            {about.who.ctaConnector}{" "}
            <Link
              href={prefixLocale(locale, "/ai-dmx-controller")}
              className="text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {about.who.ctaHow}
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-xl border border-border/40 bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-heading text-foreground">{about.cta.title}</h2>
              <p className="text-body text-muted-foreground">{about.cta.description}</p>
              <InterestCtaButton
                context="about-cta"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {actions.expressInterest}
              </InterestCtaButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
