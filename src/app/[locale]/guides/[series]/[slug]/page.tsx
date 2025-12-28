import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/GuideArticle";
import { fetchGuideInSeries, fetchGuideSeries } from "@/lib/blogGuides";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { buildDescription } from "@/lib/contentUtils";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: AppLocale; series: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, series: seriesSlug, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const series = await fetchGuideSeries(locale, seriesSlug);
  if (!series) return {};

  const post = await fetchGuideInSeries(locale, series.id, slug);
  if (!post) return {};

  const title = post.translation.seo_title ?? post.translation.title;
  const description = post.translation.seo_description ?? buildDescription(post.translation.summary, post.translation.content_html);
  const image = post.post.featured_image_url ? absoluteUrl(post.post.featured_image_url) : defaultOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: prefixLocale(locale, `/guides/${series.slug}/${post.translation.slug}`),
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

export default async function GuideSeriesPage({ params }: PageProps) {
  const { locale: localeParam, series: seriesSlug, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const series = await fetchGuideSeries(locale, seriesSlug);

  if (!series) notFound();

  const post = await fetchGuideInSeries(locale, series.id, slug);
  if (!post) notFound();

  const label = dictionary.guides.articleLabel ?? "Guide";

  return (
    <GuideArticle
      locale={locale}
      post={post}
      label={label}
      seriesName={series.name}
      breadcrumbs={[
        { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
        { label: dictionary.guides.breadcrumb, href: prefixLocale(locale, "/guides") },
        { label: series.name },
        { label: post.translation.title },
      ]}
    />
  );
}
