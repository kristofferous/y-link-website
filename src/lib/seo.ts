const defaultSiteUrl = "https://www.y-link.no";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  if (!path) {
    return siteUrl;
  }

  try {
    return new URL(path, siteUrl).toString();
  } catch {
    return siteUrl;
  }
}

export const defaultOgImage = `${siteUrl}/og-default.png`;

export function buildBreadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const position = index + 1;
      const url = item.href ? absoluteUrl(item.href) : undefined;
      return {
        "@type": "ListItem",
        position,
        name: item.label,
        ...(url ? { item: url } : {}),
      };
    }),
  };
}

export function organizationSchema(language: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Y-Link",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "hello@y-link.no",
        areaServed: "Norway",
        availableLanguage: ["no", "en"],
      },
    ],
    description:
      "Y-Link builds a deterministic autonomous lighting control platform that generates full room-aware live DMX shows from audio and configuration.",
    inLanguage: language,
  };
}

export function articleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  language,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string | null;
  dateModified: string | null;
  authorName: string | null;
  language: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: imageUrl,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": "Person",
      name: authorName ?? "Y-Link",
    },
    publisher: {
      "@type": "Organization",
      name: "Y-Link",
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
    },
    inLanguage: language,
  };
}

export function newsArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  language,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string | null;
  dateModified: string | null;
  authorName: string | null;
  language: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    image: imageUrl,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": "Person",
      name: authorName ?? "Y-Link",
    },
    publisher: {
      "@type": "Organization",
      name: "Y-Link",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
    inLanguage: language,
  };
}

export function websiteSchema(language: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Y-Link",
    url: siteUrl,
    inLanguage: language,
    potentialAction: {
      "@type": "Action",
      name: "Request access",
      target: `${siteUrl}/ai-dmx-controller`,
    },
  };
}
