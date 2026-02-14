import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { clusterSlugFromTag, type BlogPost } from "@/lib/blogGuides";
import { normalizeArticleHeadings } from "@/lib/contentUtils";
import { type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getLanguageTag } from "@/lib/i18n/translator";

type GuideArticleProps = {
  locale: AppLocale;
  post: BlogPost;
  label: string;
  breadcrumbs: { label: string; href?: string }[];
  seriesName?: string;
  tags?: string[];
  relatedCluster?: { tag: string; slug: string; items: { postId: number; category: "blog" | "guide"; title: string; path: string }[] };
  previousGuide?: { title: string; href: string; label: string };
  nextGuide?: { title: string; href: string; label: string };
};

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

export function GuideArticle({
  locale,
  post,
  label,
  breadcrumbs,
  seriesName,
  tags,
  relatedCluster,
  previousGuide,
  nextGuide,
}: GuideArticleProps) {
  const publishedAt = formatPublishDate(post.post.published_at, locale);
  const summary = post.translation.summary;
  const contentHtml = normalizeArticleHeadings(post.translation.content_html);
  const authorName = post.post.author?.full_name ?? post.post.author_name;
  const authorAvatar = post.post.author?.avatar_url ?? null;

  return (
    <main>
      <section className="section-spacing pb-8 md:pb-12 lg:pb-16">
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{label}</p>
            {tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const clusterSlug = clusterSlugFromTag(tag);
                  if (!clusterSlug) return null;
                  return (
                    <Link
                      key={tag}
                      href={prefixLocale(locale, `/topics/${clusterSlug}`)}
                      className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {tag}
                    </Link>
                  );
                })}
              </div>
            ) : null}
            <div className="space-y-2">
              {seriesName ? (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{seriesName}</p>
              ) : null}
              <h1 className="text-heading-lg text-foreground">{post.translation.title}</h1>
            </div>
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
            <div className="content-html" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
          {previousGuide || nextGuide ? (
            <div className="mx-auto mt-10 grid max-w-3xl gap-4 border-t border-border/40 pt-6 sm:grid-cols-2">
              {previousGuide ? (
                <Link
                  href={previousGuide.href}
                  className="group rounded-lg border border-border/40 bg-card p-5 transition-colors hover:bg-accent"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {previousGuide.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{previousGuide.title}</p>
                </Link>
              ) : (
                <div />
              )}
              {nextGuide ? (
                <Link
                  href={nextGuide.href}
                  className="group rounded-lg border border-border/40 bg-card p-5 transition-colors hover:bg-accent"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {nextGuide.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{nextGuide.title}</p>
                </Link>
              ) : null}
            </div>
          ) : null}
          {relatedCluster && relatedCluster.items.length > 0 ? (
            <div className="mx-auto mt-10 max-w-3xl space-y-5 border-t border-border/40 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-label text-muted-foreground">In This Cluster</p>
                  <h2 className="text-title text-foreground">{relatedCluster.tag}</h2>
                </div>
                <Link
                  href={prefixLocale(locale, `/topics/${relatedCluster.slug}`)}
                  className="text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  View topic
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedCluster.items.map((item) => (
                  <article key={`${item.category}-${item.postId}`} className="rounded-lg border border-border/40 bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.category}</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                    <Link
                      href={prefixLocale(locale, item.path)}
                      className="mt-3 inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                    >
                      Open article
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
