import { Suspense } from "react";
import type { Metadata } from "next";
import { AccessForm } from "./AccessForm";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type AccessPageProps = {
  params: { locale: AppLocale };
};

export async function generateMetadata({ params }: AccessPageProps): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.access.metadata.title,
    description: dictionary.access.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/access"),
    },
  };
}

export default async function AccessPage({ params }: AccessPageProps) {
  const locale = normalizeLocale(params.locale);
  const dictionary = await getDictionary(locale);

  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">{dictionary.access.loading}</p>
        </main>
      }
    >
      <AccessForm />
    </Suspense>
  );
}
