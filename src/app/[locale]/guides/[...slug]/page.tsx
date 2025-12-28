import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/GuideArticle";
import { fetchGuideBySlug, fetchGuideInSeries, fetchGuideSeries } from "@/lib/blogGuides";
import { buildDescription } from "@/lib/contentUtils";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: AppLocale; slug?: string[] }> };

type GuideLookup =
  | { type: "standalone"; post: Awaited<ReturnType<typeof fetchGuideBySlug>> }
  | { type: "series"; post: Awaited<ReturnType<typeof fetchGuideInSeries>>; series: Awaited<ReturnType<typeof fetchGuideSeries>> };

async function resolveGuide(locale: AppLocale, segments: string[]): Promise<GuideLookup | null> {
  if (segments.length === 1) {
    const post = await fetchGuideBySlug(locale, segments[0]);
    return post ? { type: "standalone", post } : null;
  }

  if (segments.length === 2) {
    const series = await fetchGuideSeries(locale, segments[0]);
    if (!series) return null;
    const post = await fetchGuideInSeries(locale, series.id, segments[1]);
    return post ? { type: "series", post, series } : null;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug = [] } = await params;
  const locale = normalizeLocale(localeParam);
  const resolved = await resolveGuide(locale, slug);

  if (!resolved) return {};

  const post = resolved.post;
  const title = post.translation.seo_title ?? post.translation.title;
  const description = post.translation.seo_description ?? buildDescription(post.translation.summary, post.translation.content_html);
  const image = post.post.featured_image_url ? absoluteUrl(post.post.featured_image_url) : defaultOgImage;

  const canonicalPath =
    resolved.type === "series"
      ? `/guides/${resolved.series.slug}/${post.translation.slug}`
      : `/guides/${post.translation.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: prefixLocale(locale, canonicalPath),
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
  const resolved = await resolveGuide(locale, slug);

  if (!resolved) notFound();

  const label = dictionary.guides.articleLabel ?? "Guide";
  const breadcrumbs = [
    { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
    { label: dictionary.guides.breadcrumb, href: prefixLocale(locale, "/guides") },
  ];

  if (resolved.type === "series" && resolved.series) {
    breadcrumbs.push({ label: resolved.series.name });
  }

  breadcrumbs.push({ label: resolved.post.translation.title });

  return (
    <GuideArticle
      locale={locale}
      post={resolved.post}
      label={label}
      seriesName={resolved.type === "series" ? resolved.series.name : undefined}
      breadcrumbs={breadcrumbs}
    />
  );
}
