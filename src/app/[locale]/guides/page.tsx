import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchGuideList } from "@/lib/blogGuides";
import { buildDescription } from "@/lib/contentUtils";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type GuidesPageProps = {
  params: Promise<{ locale: AppLocale }>;
  searchParams?: Promise<{ page?: string }>;
};

const PAGE_SIZE = 9;

export async function generateMetadata({ params }: GuidesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.guides.metadata.title,
    description: dictionary.guides.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/guides"),
    },
  };
}

export default async function GuidesPage({ params, searchParams }: GuidesPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { guides, navigation } = dictionary;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(resolvedSearchParams.page ?? "1") || 1);

  const { items, total, page: currentPage, pageSize } = await fetchGuideList(locale, page, PAGE_SIZE);
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
              { label: guides.breadcrumb },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">{guides.hero.label}</p>
            <h1 className="text-heading-lg text-foreground">{guides.hero.title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{guides.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          {items.length === 0 ? (
            <div className="rounded-lg border border-border/40 bg-card p-8 text-muted-foreground">
              {guides.emptyState}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((guide) => {
                const href = guide.seriesSlug
                  ? `/guides/${guide.seriesSlug}/${guide.translation.slug}`
                  : `/guides/${guide.translation.slug}`;
                return (
                  <article key={`${guide.post.id}-${guide.translation.slug}`} className="rounded-lg border border-border/40 bg-card p-6">
                    <div className="space-y-4">
                      <h2 className="text-title text-foreground">{guide.translation.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {buildDescription(guide.translation.summary, guide.translation.content_html, 140)}
                      </p>
                      <Link
                        href={prefixLocale(locale, href)}
                        className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                      >
                        {guides.readMore}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-between text-sm">
              <Link
                href={prefixLocale(locale, `/guides?page=${Math.max(1, currentPage - 1)}`)}
                className={currentPage === 1 ? "pointer-events-none text-muted-foreground/50" : "text-foreground"}
                aria-disabled={currentPage === 1}
              >
                {guides.pagination.previous}
              </Link>
              <span className="text-muted-foreground">
                {guides.pagination.pageLabel.replace("{current}", String(currentPage)).replace("{total}", String(totalPages))}
              </span>
              <Link
                href={prefixLocale(locale, `/guides?page=${Math.min(totalPages, currentPage + 1)}`)}
                className={currentPage === totalPages ? "pointer-events-none text-muted-foreground/50" : "text-foreground"}
                aria-disabled={currentPage === totalPages}
              >
                {guides.pagination.next}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
