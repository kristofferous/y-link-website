import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchTagClusterBySlug } from "@/lib/blogGuides";
import { buildDescription } from "@/lib/contentUtils";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getSessionFromCookie } from "@/lib/session";

type PageProps = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const session = await getSessionFromCookie();
  const isAdmin = session?.role === "admin";
  const cluster = await fetchTagClusterBySlug(locale, slug, { includeAllStatuses: isAdmin, limit: 1 });
  if (!cluster) return {};

  return {
    title: `${cluster.tag} Topic | Y-Link`,
    description: `Curated ${cluster.tag} guides and blog posts.`,
    alternates: {
      canonical: prefixLocale(locale, `/topics/${cluster.slug}`),
      languages: {
        "nb-NO": prefixLocale("nb", `/topics/${cluster.slug}`),
        "en-US": prefixLocale("en", `/topics/${cluster.slug}`),
      },
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const session = await getSessionFromCookie();
  const isAdmin = session?.role === "admin";
  const cluster = await fetchTagClusterBySlug(locale, slug, { includeAllStatuses: isAdmin, limit: 60 });

  if (!cluster) notFound();

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom space-y-8">
          <Breadcrumbs
            items={[
              { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: "Topics", href: prefixLocale(locale, "/topics") },
              { label: cluster.tag, href: prefixLocale(locale, `/topics/${cluster.slug}`) },
            ]}
          />

          <div className="space-y-4">
            <p className="text-label text-muted-foreground">Topic</p>
            <h1 className="text-heading-lg text-foreground">{cluster.tag}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Related guides and blog posts grouped around one operating topic.
            </p>
          </div>

          {cluster.items.length === 0 ? (
            <div className="rounded-lg border border-border/40 bg-card p-8 text-muted-foreground">
              No posts available in this topic.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cluster.items.map((item) => (
                <article key={`${item.category}-${item.postId}`} className="rounded-lg border border-border/40 bg-card p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {item.category}
                    </span>
                    {isAdmin ? (
                      <span className="rounded-full border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {item.status}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="text-title text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{buildDescription(item.summary, "", 140)}</p>
                  <Link
                    href={prefixLocale(locale, item.path)}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                  >
                    Read article
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
