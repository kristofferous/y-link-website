import type { MetadataRoute } from "next";
import { fetchPublishedTranslations, fetchSeriesTranslations } from "@/lib/blogGuides";
import { locales, type AppLocale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  "/",
  "/ai-dmx-controller",
  "/ai-dmx-controller/alternatives",
  "/ai-dmx-controller/vs-maestrodmx",
  "/use-cases",
  "/use-cases/music-reactive-dmx-clubs",
  "/use-cases/automated-dmx-small-venues",
  "/use-cases/beat-synced-lighting-without-programming",
  "/guides",
  "/om",
  "/teknisk",
  "/faq",
  "/pilot",
  "/privacy",
];

function isLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [publishedTranslations, seriesTranslations] = await Promise.all([
    fetchPublishedTranslations(),
    fetchSeriesTranslations(),
  ]);

  const seriesSlugByLocale = new Map<string, Map<string, string>>();
  for (const series of seriesTranslations) {
    if (!seriesSlugByLocale.has(series.series_id)) {
      seriesSlugByLocale.set(series.series_id, new Map());
    }
    seriesSlugByLocale.get(series.series_id)?.set(series.locale, series.slug);
  }

  const contentRoutes = publishedTranslations
    .filter((row) => isLocale(row.locale))
    .map((row) => {
      if (row.post.category === "blog") {
        return { locale: row.locale, path: `/blog/${row.slug}`, publishedAt: row.post.published_at };
      }

      if (row.post.category === "guide") {
        if (row.post.series_id) {
          const seriesSlug = seriesSlugByLocale.get(row.post.series_id)?.get(row.locale);
          if (!seriesSlug) return null;
          return { locale: row.locale, path: `/guides/${seriesSlug}/${row.slug}`, publishedAt: row.post.published_at };
        }
        return { locale: row.locale, path: `/guides/${row.slug}`, publishedAt: row.post.published_at };
      }

      return null;
    })
    .filter((route): route is { locale: AppLocale; path: string; publishedAt: string | null } => Boolean(route));

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((path) => {
      const localizedPath = path === "/" ? `/${locale}` : `/${locale}${path}`;
      return {
        url: absoluteUrl(localizedPath),
        lastModified,
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : 0.6,
      };
    }),
  );

  const dynamicEntries = contentRoutes.map((route) => {
    const localizedPath = `/${route.locale}${route.path}`;
    return {
      url: absoluteUrl(localizedPath),
      lastModified: route.publishedAt ? new Date(route.publishedAt) : lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [...staticEntries, ...dynamicEntries];
}
