import Link from "next/link";
import { InterestCtaButton } from "@/components/InterestCtaButton";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

export default async function Home({
  params,
}: {
  params: {
    locale: AppLocale;
  };
}) {
  const locale = normalizeLocale(params.locale);
  const dictionary = await getDictionary(locale);
  const { home, actions } = dictionary;

  return (
    <main>
      {/* Hero Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-accent px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-label text-muted-foreground">{home.hero.badge}</span>
            </div>

            <h1 className="text-display text-foreground">
              {home.hero.title}
              <br />
              <span className="text-muted-foreground">{home.hero.subtitle}</span>
            </h1>

            <p className="text-body-lg text-muted-foreground prose-constrained mx-auto">{home.hero.body}</p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <InterestCtaButton
                context="hero"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {actions.joinPilot}
              </InterestCtaButton>
              <Link
                href={prefixLocale(locale, "/ai-dmx-controller")}
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
              >
                {actions.learnHow}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-3">
            {home.features.map((feature) => (
              <div key={feature.title} className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-accent">
                  <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-title text-foreground">{feature.title}</h3>
                <p className="text-body text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 space-y-4 text-center">
              <p className="text-label text-muted-foreground">{home.howItWorks.eyebrow}</p>
              <h2 className="text-heading-lg text-foreground">{home.howItWorks.title}</h2>
              <p className="text-body text-muted-foreground prose-constrained mx-auto">{home.howItWorks.description}</p>
            </div>

            <div className="space-y-6">
              {home.howItWorks.steps.map((item) => (
                <div key={item.step} className="flex gap-6 rounded-lg border border-border/40 bg-card p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border/40 bg-background font-mono text-sm font-semibold text-foreground">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-title text-foreground">{item.title}</h3>
                    <p className="text-body text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-label text-muted-foreground">{home.engineering.eyebrow}</p>
                <h2 className="text-heading text-foreground">{home.engineering.title}</h2>
                <p className="text-body text-muted-foreground">{home.engineering.description}</p>
              </div>

              <div className="space-y-3">
                {home.engineering.points.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                      <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-body text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border/40 bg-card p-6">
                <div className="mb-4 text-label text-muted-foreground">{home.runtimeGuarantees.title}</div>
                <div className="space-y-4">
                  {home.runtimeGuarantees.items.map((item) => (
                    <div key={item.title} className="flex gap-3 rounded-lg border border-border/40 bg-background p-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-foreground">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-title text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">{home.runtimeGuarantees.helper}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Preview */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <p className="text-label text-muted-foreground">{home.applications.eyebrow}</p>
            <h2 className="text-heading-lg text-foreground">{home.applications.title}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {home.applications.cards.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:bg-accent"
              >
                <h3 className="text-title mb-2 text-foreground">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={prefixLocale(locale, "/use-cases")}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80"
            >
              {home.applications.cta}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl rounded-xl border border-border/40 bg-card p-8 text-center md:p-12">
            <div className="space-y-6">
              <h2 className="text-heading text-foreground">{home.cta.title}</h2>
              <p className="text-body text-muted-foreground prose-constrained mx-auto">{home.cta.description}</p>
              <InterestCtaButton
                context="cta"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {home.cta.button}
              </InterestCtaButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
