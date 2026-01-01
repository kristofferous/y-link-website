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
    description: "Y-Link builds an autonomous AI-driven DMX controller and lighting software for room-aware, music-reactive shows.",
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
