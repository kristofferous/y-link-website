import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchBlogList } from "@/lib/blogGuides";
import { buildDescription } from "@/lib/contentUtils";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type BlogPageProps = {
  params: Promise<{ locale: AppLocale }>;
  searchParams?: { page?: string };
};

const PAGE_SIZE = 9;

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.blog.metadata.title,
    description: dictionary.blog.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/blog"),
    },
  };
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { blog, navigation } = dictionary;
  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);

  const { items, total, page: currentPage, pageSize } = await fetchBlogList(locale, page, PAGE_SIZE);
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages > 0 && currentPage > totalPages) {
    notFound();
  }

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
              { label: blog.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{blog.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{blog.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{blog.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          {items.length === 0 ? (
            <div className="rounded-lg border border-border/40 bg-card p-8 text-muted-foreground">
              {blog.emptyState}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => (
                <article key={`${post.post.id}-${post.translation.slug}`} className="rounded-lg border border-border/40 bg-card p-6">
                  <div className="space-y-4">
                    <h2 className="text-title text-foreground">{post.translation.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {buildDescription(post.translation.summary, post.translation.content_html, 140)}
                    </p>
                    <Link
                      href={prefixLocale(locale, `/blog/${post.translation.slug}`)}
                      className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                    >
                      {blog.readMore}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-between text-sm">
              <Link
                href={prefixLocale(locale, `/blog?page=${Math.max(1, currentPage - 1)}`)}
                className={currentPage === 1 ? "pointer-events-none text-muted-foreground/50" : "text-foreground"}
                aria-disabled={currentPage === 1}
              >
                {blog.pagination.previous}
              </Link>
              <span className="text-muted-foreground">
                {blog.pagination.pageLabel.replace("{current}", String(currentPage)).replace("{total}", String(totalPages))}
              </span>
              <Link
                href={prefixLocale(locale, `/blog?page=${Math.min(totalPages, currentPage + 1)}`)}
                className={currentPage === totalPages ? "pointer-events-none text-muted-foreground/50" : "text-foreground"}
                aria-disabled={currentPage === totalPages}
              >
                {blog.pagination.next}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
