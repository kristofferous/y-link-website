import { redirect } from "next/navigation";
import { normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};

export default async function LegacyClusterSlugPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = normalizeLocale(localeParam);
  redirect(prefixLocale(locale, `/topics/${slug}`));
}
