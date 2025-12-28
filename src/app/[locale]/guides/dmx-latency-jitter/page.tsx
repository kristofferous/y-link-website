import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/GuideArticle";
import { fetchGuideBySlug } from "@/lib/blogGuides";
import { buildDescription } from "@/lib/contentUtils";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: AppLocale }> };

const GUIDE_SLUG = "dmx-latency-jitter";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const post = await fetchGuideBySlug(locale, GUIDE_SLUG);

  if (!post) return {};

  const title = post.translation.seo_title ?? post.translation.title;
  const description = post.translation.seo_description ?? buildDescription(post.translation.summary, post.translation.content_html);
  const image = post.post.featured_image_url ? absoluteUrl(post.post.featured_image_url) : defaultOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: prefixLocale(locale, `/guides/${post.translation.slug}`),
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

export default async function GuideStaticPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const post = await fetchGuideBySlug(locale, GUIDE_SLUG);

  if (!post) notFound();
  const label = dictionary.guides.articleLabel ?? "Guide";

  return (
    <GuideArticle
      locale={locale}
      post={post}
      label={label}
      breadcrumbs={[
        { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
        { label: dictionary.guides.breadcrumb, href: prefixLocale(locale, "/guides") },
        { label: post.translation.title },
      ]}
    />
  );
}
