"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { accessAction } from "@/app/access/actions";
import { prefixLocale } from "@/lib/i18n/routing";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

const initialState = { status: "idle" as const, message: "" };

export function AccessForm() {
  const { locale, dictionary } = useTranslations();
  const { access } = dictionary;
  const params = useSearchParams();
  const redirectTo = params?.get("redirectTo") ?? prefixLocale(locale, "/studio/download");
  const [state, formAction] = useActionState(accessAction, initialState);

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 space-y-4">
              <p className="text-label text-muted-foreground">{access.hero.label}</p>
              <h1 className="text-heading text-foreground">{access.hero.title}</h1>
              <p className="text-body text-muted-foreground">{access.hero.body}</p>
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-6">
              <form action={formAction} className="space-y-5">
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <input type="hidden" name="locale" value={locale} />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="email">
                    {access.form.emailLabel}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={access.form.emailPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="code">
                    {access.form.codeLabel}
                  </label>
                  <input
                    id="code"
                    name="code"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={access.form.codePlaceholder}
                  />
                </div>
                {state.status === "error" && state.message ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive-foreground">
                    {state.message}
                  </div>
                ) : null}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                >
                  {access.form.submit}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {access.footer.questions}{" "}
              <Link
                href={prefixLocale(locale, "/pilot")}
                className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
              >
                {access.footer.pilotLink}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
