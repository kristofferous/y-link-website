import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
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
  "/guides/dmx-basics",
  "/guides/dmx-addressing",
  "/guides/dmx-universes",
  "/guides/dmx-latency-jitter",
  "/guides/dmx-best-practices",
  "/guides/dmx-troubleshooting",
  "/om",
  "/teknisk",
  "/faq",
  "/pilot",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
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
}
