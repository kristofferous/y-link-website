const defaultSiteUrl = "https://y-link.no";

export const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/$/, "");

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

export const defaultTitle =
  "AI-styrt DMX-kontroller for musikkstyrt lys | Y-Link";

export const defaultDescription =
  "Y-Link er en AI-drevet DMX-kontroller som gjør lyd om til presist, musikkstyrt lys uten manuell programmering.";

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

export const organizationSchema = {
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
      areaServed: "Norge",
      availableLanguage: ["no"],
    },
  ],
  description:
    "Y-Link bygger en AI-drevet DMX-kontroller og lysprogramvare for forutsigbare, musikkstyrte show.",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Y-Link",
  url: siteUrl,
  inLanguage: "nb",
  potentialAction: {
    "@type": "Action",
    name: "Be om tilgang",
    target: `${siteUrl}/ai-dmx-controller`,
  },
};
