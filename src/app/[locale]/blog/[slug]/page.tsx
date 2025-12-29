import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchBlogPostBySlug, fetchTranslationSlugs } from "@/lib/blogGuides";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { getLanguageTag } from "@/lib/i18n/translator";
import { prefixLocale } from "@/lib/i18n/routing";
import { buildDescription } from "@/lib/contentUtils";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: AppLocale; slug: string }> };

function formatPublishDate(value: string | null, locale: AppLocale) {
  if (!value) return null;
  return new Intl.DateTimeFormat(getLanguageTag(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const post = await fetchBlogPostBySlug(locale, slug);

  if (!post) return {};

  const title = post.translation.seo_title ?? post.translation.title;
  const description = post.translation.seo_description ?? buildDescription(post.translation.summary, post.translation.content_html);
  const image = post.post.featured_image_url ? absoluteUrl(post.post.featured_image_url) : defaultOgImage;
  const translationSlugs = await fetchTranslationSlugs(post.post.id);
  const languageAlternates: Record<string, string> = {};
  if (translationSlugs.nb) {
    languageAlternates["nb-NO"] = prefixLocale("nb", `/blog/${translationSlugs.nb}`);
  }
  if (translationSlugs.en) {
    languageAlternates["en-US"] = prefixLocale("en", `/blog/${translationSlugs.en}`);
  }

  return {
    title,
    description,
    alternates: {
      canonical: prefixLocale(locale, `/blog/${post.translation.slug}`),
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

export default async function BlogPostPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const post = await fetchBlogPostBySlug(locale, slug);

  if (!post) notFound();

  const publishedAt = formatPublishDate(post.post.published_at, locale);
  const summary = post.translation.summary;
  const label = dictionary.blog?.breadcrumb ?? "Blog";
  const authorName = post.post.author?.full_name ?? post.post.author_name;
  const authorAvatar = post.post.author?.avatar_url ?? null;

  return (
    <main>
      <section className="section-spacing pb-8 md:pb-12 lg:pb-16">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: dictionary.navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label },
              { label: post.translation.title },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{label}</p>
            <h1 className="text-heading-lg text-foreground">{post.translation.title}</h1>
            {summary ? <p className="text-body-lg text-muted-foreground prose-constrained">{summary}</p> : null}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {authorName ? (
                <span className="flex items-center gap-2 text-foreground">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {getInitials(authorName)}
                    </span>
                  )}
                  <span className="text-sm font-medium">{authorName}</span>
                </span>
              ) : null}
              {publishedAt ? <span>{publishedAt}</span> : null}
              {post.post.reading_time ? <span>{post.post.reading_time}</span> : null}
            </div>
            {post.post.featured_image_url ? (
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card">
                <Image
                  src={post.post.featured_image_url}
                  alt={post.translation.title}
                  width={1200}
                  height={630}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}
            {post.post.takeaway ? (
              <div className="rounded-lg border border-border/40 bg-card p-6 text-body text-foreground">
                {post.post.takeaway}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 pt-8 pb-16 md:pb-20 lg:pb-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <div
              className="content-html"
              dangerouslySetInnerHTML={{ __html: post.translation.content_html }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
