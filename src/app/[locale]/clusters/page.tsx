import { redirect } from "next/navigation";
import { normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function LegacyClustersPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  redirect(prefixLocale(locale, "/topics"));
}
