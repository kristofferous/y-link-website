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
  const cluster = await fetchTagClusterBySlug(locale, slug, { includeAllStatuses: isAdmin, limit: 2 });
  if (!cluster) return {};
  const robots =
    cluster.items.length < 2
      ? {
          index: false,
          follow: true,
        }
      : undefined;

  return {
    title: `${cluster.tag} Topic | Y-Link`,
    description: `Guides and blog posts about ${cluster.tag}.`,
    robots,
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

  const guides = cluster.items.filter((item) => item.category === "guide");
  const blogs = cluster.items.filter((item) => item.category === "blog");
  const readingPath = [...guides, ...blogs].slice(0, 6);

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
              Everything in this topic, including step-by-step guides and practical articles you can use right away.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-border/40 bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">What you will find here</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Core concepts, practical setup steps, and common troubleshooting tips for {cluster.tag}.
              </p>
            </article>
            <article className="rounded-lg border border-border/40 bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">How much content is here</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {cluster.items.length} articles ({guides.length} guides and {blogs.length} blog posts).
              </p>
            </article>
            <article className="rounded-lg border border-border/40 bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">How to use this page</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with the reading path below, or jump directly to the article that matches your current task.
              </p>
            </article>
          </div>

          {readingPath.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-heading text-foreground">Recommended Reading Order</h2>
              <div className="grid gap-3">
                {readingPath.map((item, index) => (
                  <Link
                    key={`path-${item.category}-${item.postId}`}
                    href={prefixLocale(locale, item.path)}
                    className="rounded-lg border border-border/40 bg-card px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    {index + 1}. {item.title}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

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

          <section className="space-y-3 rounded-lg border border-border/40 bg-card p-6">
            <h2 className="text-heading text-foreground">FAQ</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">When should I use this topic page vs a single article?</p>
                <p>Use this page for the full topic map. Use single articles for one task or one specific fault condition.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">How are items selected for this topic?</p>
                <p>Items are grouped under one topic so related tags are shown together in a single place.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Can this topic include drafts?</p>
                <p>Only for approved admin sessions. Public visitors only see published or due scheduled content.</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
