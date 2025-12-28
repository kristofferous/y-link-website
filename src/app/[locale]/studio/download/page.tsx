import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { validatePilotAccessByEmail } from "@/lib/pilotAccess";
import { getSessionFromCookie } from "@/lib/session";
import { logoutAction } from "@/app/access/actions";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const meta = dictionary.studio.download.metadata;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: prefixLocale(locale, "/studio/download"),
    },
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const copy = dictionary.studio.download;
  const session = await getSessionFromCookie();
  if (!session || !session.email) {
    redirect(`${prefixLocale(locale, "/access")}?redirectTo=${encodeURIComponent(prefixLocale(locale, "/studio/download"))}`);
  }

  const pilot = await validatePilotAccessByEmail(session.email);
  if (!pilot.ok) {
    return (
      <main>
        <section className="section-spacing">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 space-y-4">
                <p className="text-label text-muted-foreground">{copy.access.label}</p>
                <h1 className="text-heading text-foreground">{copy.access.title}</h1>
              </div>

              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
                <p className="text-body text-muted-foreground">{copy.access.body}</p>
                <Link
                  href={prefixLocale(locale, "/access")}
                  className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {copy.access.back}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 space-y-4">
              <p className="text-label text-muted-foreground">{copy.active.label}</p>
              <h1 className="text-heading text-foreground">{copy.active.title}</h1>
              <p className="text-body text-muted-foreground">{copy.active.body}</p>
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-6 space-y-6">
              <div className="space-y-4">
                <Link
                  href="/api/download"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                >
                  {copy.active.button}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {copy.active.pilotType} {pilot.pilotType ?? copy.active.unknown}. {copy.active.expires}{" "}
                  {pilot.expiresAt ? pilot.expiresAt : copy.active.noExpiry}.
                </p>
              </div>

              <div className="border-t border-border/40 pt-6">
                <form action={logoutAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-border bg-accent px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                  >
                    {copy.logout}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
