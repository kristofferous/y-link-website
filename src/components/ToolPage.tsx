import type { ReactNode } from "react";
import clsx from "clsx";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { absoluteUrl, buildBreadcrumbSchema, siteUrl } from "@/lib/seo";

type ToolBreadcrumb = {
  label: string;
  href?: string;
};

type ToolPageProps = {
  lang: string;
  title: string;
  description: string;
  intro?: string;
  breadcrumbs: ToolBreadcrumb[];
  canonicalPath: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  cta?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ToolPage({
  lang,
  title,
  description,
  intro,
  breadcrumbs,
  canonicalPath,
  structuredData,
  cta,
  children,
  className,
}: ToolPageProps) {
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: absoluteUrl(canonicalPath),
    inLanguage: lang,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Y-Link",
      url: siteUrl,
    },
  };

  const extraStructuredData = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
  const combinedStructuredData = [toolSchema, breadcrumbSchema, ...extraStructuredData];

  return (
    <main>
      <StructuredData data={combinedStructuredData} />
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            {intro ? <p className="text-label text-muted-foreground">{intro}</p> : null}
            <h1 className="text-heading-lg text-foreground">{title}</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">{description}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
          <div className={clsx("container-custom space-y-12", className)}>
            {children}
            {cta ? <div className="pt-6">{cta}</div> : null}
          </div>
        </section>
    </main>
  );
}
