import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchAllClusterTags, fetchTagClusterBySlug } from "@/lib/blogGuides";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getSessionFromCookie } from "@/lib/session";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  return {
    title: "Topics | Y-Link",
    description: "Browse guides and blog posts by topic.",
    alternates: {
      canonical: prefixLocale(locale, "/topics"),
      languages: {
        "nb-NO": prefixLocale("nb", "/topics"),
        "en-US": prefixLocale("en", "/topics"),
      },
    },
  };
}

export default async function TopicsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const session = await getSessionFromCookie();
  const isAdmin = session?.role === "admin";
  const clusters = await fetchAllClusterTags();

  const clustersWithTwoOrMoreItems = (
    await Promise.all(
      clusters.map(async (cluster) => {
        const details = await fetchTagClusterBySlug(locale, cluster.slug, {
          includeAllStatuses: isAdmin,
          limit: 2,
        });
        if (!details || details.items.length < 2) return null;
        return cluster;
      }),
    )
  ).filter((cluster): cluster is (typeof clusters)[number] => Boolean(cluster));

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom space-y-8">
          <Breadcrumbs
            items={[
              { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: "Topics", href: prefixLocale(locale, "/topics") },
            ]}
          />

          <div className="space-y-4">
            <p className="text-label text-muted-foreground">Explore by Topic</p>
            <h1 className="text-heading-lg text-foreground">Topics</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Find related guides and blog posts in one place, grouped by the topic you are working on.
            </p>
          </div>

          {clustersWithTwoOrMoreItems.length === 0 ? (
            <div className="rounded-lg border border-border/40 bg-card p-8 text-muted-foreground">No topics published yet.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clustersWithTwoOrMoreItems.map((cluster) => (
                <Link
                  key={cluster.slug}
                  href={prefixLocale(locale, `/topics/${cluster.slug}`)}
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
