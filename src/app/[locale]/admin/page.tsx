import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminLogoutAction } from "@/app/admin/actions";
import { fetchBlogListAllStatuses, fetchGuideListAllStatuses } from "@/lib/blogGuides";
import { normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { getSessionFromCookie } from "@/lib/session";
import { prefixLocale } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Content",
    robots: { index: false, follow: false },
  };
}

export default async function AdminPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const session = await getSessionFromCookie();

  if (!session || session.role !== "admin") {
    notFound();
  }

  const [blogs, guides] = await Promise.all([
    fetchBlogListAllStatuses(locale, 1, 100),
    fetchGuideListAllStatuses(locale, 1, 100),
  ]);

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-label text-muted-foreground">Admin</p>
              <h1 className="text-heading text-foreground">Content Visibility</h1>
              <p className="text-body text-muted-foreground">Includes published, scheduled, and draft items.</p>
            </div>
            <form action={adminLogoutAction}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-border bg-accent px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
              >
                Sign out
              </button>
            </form>
          </div>

          <div className="space-y-4 rounded-xl border border-border/40 bg-card p-6">
            <h2 className="text-title text-foreground">Blogs ({blogs.total})</h2>
            <div className="space-y-3">
              {blogs.items.map((item) => (
                <article key={item.post.id} className="rounded-lg border border-border/40 bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{item.translation.title}</p>
                    <span className="rounded-full border border-border px-2 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {item.post.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <Link href={prefixLocale(locale, `/blog/${item.translation.slug}`)} className="underline underline-offset-2">
                      {item.translation.slug}
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border/40 bg-card p-6">
            <h2 className="text-title text-foreground">Guides ({guides.total})</h2>
            <div className="space-y-3">
              {guides.items.map((item) => {
                const href = item.seriesSlug
                  ? prefixLocale(locale, `/guides/${item.seriesSlug}/${item.translation.slug}`)
                  : prefixLocale(locale, `/guides/${item.translation.slug}`);
                return (
                  <article key={item.post.id} className="rounded-lg border border-border/40 bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{item.translation.title}</p>
                      <span className="rounded-full border border-border px-2 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {item.post.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <Link href={href} className="underline underline-offset-2">
                        {item.translation.slug}
                      </Link>
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
