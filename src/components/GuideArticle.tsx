import { Breadcrumbs } from "@/components/Breadcrumbs";
import { type BlogPost } from "@/lib/blogGuides";
import { type AppLocale } from "@/lib/i18n/config";
import { getLanguageTag } from "@/lib/i18n/translator";

type GuideArticleProps = {
  locale: AppLocale;
  post: BlogPost;
  label: string;
  breadcrumbs: { label: string; href?: string }[];
  seriesName?: string;
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

export function GuideArticle({ locale, post, label, breadcrumbs, seriesName }: GuideArticleProps) {
  const publishedAt = formatPublishDate(post.post.published_at, locale);
  const summary = post.translation.summary;
  const authorName = post.post.author?.full_name ?? post.post.author_name;
  const authorAvatar = post.post.author?.avatar_url ?? null;

  return (
    <main>
      <section className="section-spacing pb-8 md:pb-12 lg:pb-16">
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{label}</p>
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
                    <img src={authorAvatar} alt={authorName} className="h-8 w-8 rounded-full object-cover" />
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
                <img
                  src={post.post.featured_image_url}
                  alt={post.translation.title}
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

      <section className=" border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <div className="content-html" dangerouslySetInnerHTML={{ __html: post.translation.content_html }} />
          </div>
        </div>
      </section>
    </main>
  );
}
