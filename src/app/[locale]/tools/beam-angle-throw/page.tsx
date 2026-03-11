import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolPage } from "@/components/ToolPage";
import { BeamAngleTool } from "@/components/tools/BeamAngleTool";
import { SectionCard } from "@/components/SectionCard";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getLanguageTag } from "@/lib/i18n/translator";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type BeamAnglePageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: BeamAnglePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const canonicalPath = prefixLocale(locale, "/tools/beam-angle-throw");
  const ogAlt = dictionary.meta?.ogAlt ?? "Y-Link";

  return {
    title: dictionary.tools.beamAngle.metadata.title,
    description: dictionary.tools.beamAngle.metadata.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "nb-NO": prefixLocale("nb", "/tools/beam-angle-throw"),
        "en-US": prefixLocale("en", "/tools/beam-angle-throw"),
      },
    },
    openGraph: {
      title: dictionary.tools.beamAngle.metadata.title,
      description: dictionary.tools.beamAngle.metadata.description,
      url: absoluteUrl(canonicalPath),
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.tools.beamAngle.metadata.title,
      description: dictionary.tools.beamAngle.metadata.description,
      images: [defaultOgImage],
    },
  };
}

export default async function BeamAnglePage({ params }: BeamAnglePageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const lang = getLanguageTag(locale);
  const { tools, navigation } = dictionary;
  const tool = tools.beamAngle;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.howTo.title,
    description: tool.metadata.description,
    step: tool.howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
  };

  const breadcrumbs = [
    { label: navigation.main[0].label, href: prefixLocale(locale, "/") },
    { label: tools.breadcrumb, href: prefixLocale(locale, "/tools") },
    { label: tool.breadcrumb },
  ];

  return (
    <ToolPage
      lang={lang}
      title={tool.metadata.title}
      description={tool.metadata.description}
      intro={tool.intro.eyebrow}
      breadcrumbs={breadcrumbs}
      canonicalPath={prefixLocale(locale, "/tools/beam-angle-throw")}
      structuredData={howToSchema}
    >
      <ToolIntro title={tool.intro.title} body={tool.intro.body} />
      <ToolHowTo title={tool.howTo.title} steps={tool.howTo.steps} />
      <Suspense>
        <BeamAngleTool />
      </Suspense>
      <ToolDetails data={tool.details} />
    </ToolPage>
  );
}

function ToolIntro({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-heading text-foreground">{title}</h2>
      <p className="text-body text-muted-foreground">{body}</p>
    </div>
  );
}

function ToolHowTo({ title, steps }: { title: string; steps: string[] }) {
  return (
    <SectionCard>
      <div className="space-y-4">
        <p className="text-title text-foreground">{title}</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </SectionCard>
  );
}

function ToolDetails({ data }: { data: { title: string; sections: Array<{ title: string; body: string }> } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-heading text-foreground">{data.title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {data.sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-border/40 bg-card p-6">
            <div className="space-y-3">
              <p className="text-title text-foreground">{section.title}</p>
              <p className="text-sm text-muted-foreground">{section.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
