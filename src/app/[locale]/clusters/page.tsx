import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchAllClusterTags } from "@/lib/blogGuides";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  return {
    title: "Content Clusters | Y-Link",
    description: "Explore grouped guides and blog posts by topic.",
    alternates: {
      canonical: prefixLocale(locale, "/clusters"),
      languages: {
        "nb-NO": prefixLocale("nb", "/clusters"),
        "en-US": prefixLocale("en", "/clusters"),
      },
    },
  };
}

export default async function ClustersPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const clusters = await fetchAllClusterTags();

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom space-y-8">
          <Breadcrumbs
            items={[
              { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: "Clusters", href: prefixLocale(locale, "/clusters") },
            ]}
          />

          <div className="space-y-4">
            <p className="text-label text-muted-foreground">Explore by Topic</p>
            <h1 className="text-heading-lg text-foreground">Content Clusters</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Collections of related guides and blogs grouped around practical DMX and show-control workflows.
            </p>
          </div>

          {clusters.length === 0 ? (
            <div className="rounded-lg border border-border/40 bg-card p-8 text-muted-foreground">No clusters published yet.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clusters.map((cluster) => (
                <Link
                  key={cluster.slug}
                  href={prefixLocale(locale, `/clusters/${cluster.slug}`)}
                  className="rounded-lg border border-border/40 bg-card p-5 transition-colors hover:bg-accent"
                >
                  <p className="text-sm font-semibold text-foreground">{cluster.tag}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
