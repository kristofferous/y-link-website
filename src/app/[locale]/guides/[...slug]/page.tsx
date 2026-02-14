import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideArticle } from "@/components/GuideArticle";
import {
  fetchGuideBySlug,
  fetchGuideBySlugAllStatuses,
  fetchGuideInSeries,
  fetchGuideInSeriesAllStatuses,
  fetchGuideNavItem,
  fetchGuideSeries,
  fetchGuidesForSeries,
  fetchGuidesForSeriesAllStatuses,
  fetchPostTags,
  fetchTagClusterByTag,
  fetchSeriesTranslationSlugs,
  fetchTranslationSlugs,
} from "@/lib/blogGuides";
import { buildDescription } from "@/lib/contentUtils";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";
import { getSessionFromCookie } from "@/lib/session";

type PageProps = { params: Promise<{ locale: AppLocale; slug?: string[] }> };

type GuideLookup =
  | { type: "standalone"; post: Awaited<ReturnType<typeof fetchGuideBySlug>> }
  | { type: "seriesGuide"; post: Awaited<ReturnType<typeof fetchGuideInSeries>>; series: Awaited<ReturnType<typeof fetchGuideSeries>> }
  | { type: "seriesLanding"; series: Awaited<ReturnType<typeof fetchGuideSeries>> };

async function resolveGuide(locale: AppLocale, segments: string[], includeAllStatuses: boolean): Promise<GuideLookup | null> {
  if (segments.length === 1) {
    const series = await fetchGuideSeries(locale, segments[0]);
    if (series) return { type: "seriesLanding", series };
    const post = includeAllStatuses
      ? await fetchGuideBySlugAllStatuses(locale, segments[0])
      : await fetchGuideBySlug(locale, segments[0]);
    return post ? { type: "standalone", post } : null;
  }

  if (segments.length === 2) {
    const series = await fetchGuideSeries(locale, segments[0]);
    if (!series) return null;
    const post = includeAllStatuses
      ? await fetchGuideInSeriesAllStatuses(locale, series.id, segments[1])
      : await fetchGuideInSeries(locale, series.id, segments[1]);
    return post ? { type: "seriesGuide", post, series } : null;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug = [] } = await params;
  const locale = normalizeLocale(localeParam);
  const session = await getSessionFromCookie();
  const isAdmin = session?.role === "admin";
  const resolved = await resolveGuide(locale, slug, isAdmin);

  if (!resolved) return {};

  if (resolved.type === "seriesLanding") {
    const title = resolved.series.seo_title ?? resolved.series.name;
    const description = resolved.series.seo_description ?? resolved.series.description ?? resolved.series.name;
    const seriesSlugs = await fetchSeriesTranslationSlugs(resolved.series.id);
    const languageAlternates: Record<string, string> = {};
    if (seriesSlugs.nb) {
      languageAlternates["nb-NO"] = prefixLocale("nb", `/guides/${seriesSlugs.nb}`);
    }
    if (seriesSlugs.en) {
      languageAlternates["en-US"] = prefixLocale("en", `/guides/${seriesSlugs.en}`);
    }
    return {
      title,
      description,
      alternates: {
        canonical: prefixLocale(locale, `/guides/${resolved.series.slug}`),
        languages: Object.keys(languageAlternates).length > 0 ? languageAlternates : undefined,
      },
    };
  }

  const post = resolved.post;
  const title = post.translation.seo_title ?? post.translation.title;
  const description = post.translation.seo_description ?? buildDescription(post.translation.summary, post.translation.content_html);
  const image = post.post.featured_image_url ? absoluteUrl(post.post.featured_image_url) : defaultOgImage;
  const tags = await fetchPostTags(post.post.id);
  const translationSlugs = await fetchTranslationSlugs(post.post.id);
  const languageAlternates: Record<string, string> = {};
  if (resolved.type === "seriesGuide") {
    const seriesSlugs = await fetchSeriesTranslationSlugs(resolved.series.id);
    if (translationSlugs.nb && seriesSlugs.nb) {
      languageAlternates["nb-NO"] = prefixLocale("nb", `/guides/${seriesSlugs.nb}/${translationSlugs.nb}`);
    }
    if (translationSlugs.en && seriesSlugs.en) {
      languageAlternates["en-US"] = prefixLocale("en", `/guides/${seriesSlugs.en}/${translationSlugs.en}`);
    }
  } else {
    if (translationSlugs.nb) {
      languageAlternates["nb-NO"] = prefixLocale("nb", `/guides/${translationSlugs.nb}`);
    }
    if (translationSlugs.en) {
      languageAlternates["en-US"] = prefixLocale("en", `/guides/${translationSlugs.en}`);
    }
  }

  const canonicalPath =
    resolved.type === "seriesGuide"
      ? `/guides/${resolved.series.slug}/${post.translation.slug}`
      : `/guides/${post.translation.slug}`;

  return {
    title,
    description,
    keywords: tags.length > 0 ? tags : undefined,
    alternates: {
      canonical: prefixLocale(locale, canonicalPath),
      languages: Object.keys(languageAlternates).length > 0 ? languageAlternates : undefined,
    },
    openGraph: {
      type: "article",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.translation.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function GuideCatchAllPage({ params }: PageProps) {
  const { locale: localeParam, slug = [] } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const session = await getSessionFromCookie();
  const isAdmin = session?.role === "admin";
  const resolved = await resolveGuide(locale, slug, isAdmin);

  if (!resolved) notFound();

  if (resolved.type === "seriesLanding") {
    if (!resolved.series) notFound();
    const guides = isAdmin
      ? await fetchGuidesForSeriesAllStatuses(locale, resolved.series.id)
      : await fetchGuidesForSeries(locale, resolved.series.id);
    return (
      <main>
        <section className="section-spacing">
          <div className="container-custom">
            <Breadcrumbs
              items={[
                { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
                { label: dictionary.guides.breadcrumb, href: prefixLocale(locale, "/guides") },
                { label: resolved.series.name, href: prefixLocale(locale, `/guides/${resolved.series.slug}`) },
              ]}
              className="mb-8"
            />
            <div className="mx-auto max-w-4xl space-y-6">
              <p className="text-label text-muted-foreground">{dictionary.guides.seriesLabel}</p>
              <h1 className="text-heading-lg text-foreground">{resolved.series.name}</h1>
              {resolved.series.description ? (
                <p className="text-body-lg text-muted-foreground prose-constrained">{resolved.series.description}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="section-spacing border-t border-border/40">
          <div className="container-custom">
            {guides.length === 0 ? (
              <div className="rounded-lg border border-border/40 bg-card p-8 text-muted-foreground">
                {dictionary.guides.emptyState}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide) => (
                  <article key={`${guide.post.id}-${guide.translation.slug}`} className="rounded-lg border border-border/40 bg-card p-6">
                    <div className="space-y-4">
                      <h2 className="text-title text-foreground">{guide.translation.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {buildDescription(guide.translation.summary, guide.translation.content_html, 140)}
                      </p>
                      <Link
                        href={prefixLocale(locale, `/guides/${resolved.series.slug}/${guide.translation.slug}`)}
                        className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                      >
                        {dictionary.guides.readMore}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  const label = dictionary.guides.articleLabel ?? "Guide";
  const tags = await fetchPostTags(resolved.post.post.id);
  const cluster = tags[0]
    ? await fetchTagClusterByTag(locale, tags[0], {
        includeAllStatuses: isAdmin,
        excludePostId: resolved.post.post.id,
        limit: 4,
      })
    : null;
  const breadcrumbs = [
    { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
    { label: dictionary.guides.breadcrumb, href: prefixLocale(locale, "/guides") },
  ];

  if (resolved.type === "seriesGuide") {
    if (!resolved.series) notFound();
    breadcrumbs.push({
      label: resolved.series.name,
      href: prefixLocale(locale, `/guides/${resolved.series.slug}`),
    });
  }

  const currentPath =
    resolved.type === "seriesGuide"
      ? `/guides/${resolved.series.slug}/${resolved.post.translation.slug}`
      : `/guides/${resolved.post.translation.slug}`;
  breadcrumbs.push({ label: resolved.post.translation.title, href: prefixLocale(locale, currentPath) });

  const previousGuide = resolved.post.post.prev_guide_id
    ? await fetchGuideNavItem(locale, resolved.post.post.prev_guide_id)
    : null;
  const nextGuide = resolved.post.post.next_guide_id
    ? await fetchGuideNavItem(locale, resolved.post.post.next_guide_id)
    : null;

  return (
    <GuideArticle
      locale={locale}
      post={resolved.post}
      label={label}
      tags={tags}
      relatedCluster={cluster ? { tag: cluster.tag, slug: cluster.slug, items: cluster.items } : undefined}
      seriesName={resolved.type === "seriesGuide" ? resolved.series.name : undefined}
      breadcrumbs={breadcrumbs}
      previousGuide={
        previousGuide
          ? {
              title: previousGuide.title,
              href: prefixLocale(locale, previousGuide.path),
              label: dictionary.guides.navigation.previous,
            }
          : undefined
      }
      nextGuide={
        nextGuide
          ? {
              title: nextGuide.title,
              href: prefixLocale(locale, nextGuide.path),
              label: dictionary.guides.navigation.next,
            }
          : undefined
      }
    />
  );
}
