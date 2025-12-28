import { randomUUID } from "crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabaseServer";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

type UnsubscribeStatus = "invalid" | "error" | "expired" | "success";

async function handleUnsubscribe(token: string | undefined): Promise<UnsubscribeStatus> {
  if (!token) {
    return "invalid";
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("email_subscriptions")
      .update({
        subscribed: false,
        unsubscribe_token: randomUUID(),
      })
      .eq("unsubscribe_token", token)
      .select("email")
      .maybeSingle();

    if (error) {
      console.error(error);
      return "error";
    }

    if (!data) {
      return "expired";
    }

    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}

type UnsubscribePageProps = {
  params: Promise<{ locale: AppLocale }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: UnsubscribePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.unsubscribe.metadata.title,
    description: dictionary.unsubscribe.metadata.description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: prefixLocale(locale, "/unsubscribe"),
    },
  };
}

export default async function UnsubscribePage({ params, searchParams }: UnsubscribePageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const { unsubscribe, navigation } = dictionary;
  const tokenParam = searchParams?.token;
  const token = typeof tokenParam === "string" ? tokenParam : Array.isArray(tokenParam) ? tokenParam[0] : undefined;

  const status = await handleUnsubscribe(token);
  const message = unsubscribe.messages[status];

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 space-y-4">
              <p className="text-label text-muted-foreground">{unsubscribe.hero.label}</p>
              <h1 className="text-heading text-foreground">{unsubscribe.hero.title}</h1>
            </div>

            <div
              className={`rounded-xl border p-6 ${
                status === "success" ? "border-primary/40 bg-card" : "border-destructive/40 bg-card"
              }`}
            >
              <p className="text-body text-foreground">{message}</p>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {unsubscribe.cta.question}{" "}
              <Link
                href={prefixLocale(locale, "/")}
                className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
              >
                {unsubscribe.cta.link}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
