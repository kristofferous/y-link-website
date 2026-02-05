import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type ToolsPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: ToolsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.tools.metadata.title,
    description: dictionary.tools.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/tools"),
      languages: {
        "nb-NO": prefixLocale("nb", "/tools"),
        "en-US": prefixLocale("en", "/tools"),
        "x-default": prefixLocale("en", "/tools"),
      },
    },
  };
}

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { tools, navigation } = dictionary;

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: tools.breadcrumb, href: prefixLocale(locale, "/tools") },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{tools.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{tools.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{tools.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.cards.map((tool) => (
              <article key={tool.href} className="rounded-lg border border-border/40 bg-card p-6">
                <div className="space-y-4">
                  {tool.tag ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{tool.tag}</p>
                  ) : null}
                  <h2 className="text-title text-foreground">{tool.title}</h2>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <Link
                    href={prefixLocale(locale, tool.href)}
                    className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                  >
                    {tools.hero.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
