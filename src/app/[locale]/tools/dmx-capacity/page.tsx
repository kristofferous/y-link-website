import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/ToolPage";
import { DmxCapacityTool } from "@/components/tools/DmxCapacityTool";
import { SectionCard } from "@/components/SectionCard";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getLanguageTag } from "@/lib/i18n/translator";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type DmxCapacityPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: DmxCapacityPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const canonicalPath = prefixLocale(locale, "/tools/dmx-capacity");
  const ogAlt = dictionary.meta?.ogAlt ?? "Y-Link";

  return {
    title: dictionary.tools.dmxCapacity.metadata.title,
    description: dictionary.tools.dmxCapacity.metadata.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "nb-NO": prefixLocale("nb", "/tools/dmx-capacity"),
        "en-US": prefixLocale("en", "/tools/dmx-capacity"),
      },
    },
    openGraph: {
      title: dictionary.tools.dmxCapacity.metadata.title,
      description: dictionary.tools.dmxCapacity.metadata.description,
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
      title: dictionary.tools.dmxCapacity.metadata.title,
      description: dictionary.tools.dmxCapacity.metadata.description,
      images: [defaultOgImage],
    },
  };
}

export default async function DmxCapacityPage({ params }: DmxCapacityPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const lang = getLanguageTag(locale);
  const { tools, navigation } = dictionary;
  const tool = tools.dmxCapacity;
  const channelsGuidePath =
    locale === "en"
      ? "/guides/getting-started-with-dmx-lighting/channels-addresses-and-universes"
      : "/guides/kom-i-gang-med-dmx-belysning/channels-addresses-and-universes";
  const universesGuidePath = "/guides/how-many-dmx-universes-do-you-actually-need";
  const channelsGuideLabel = locale === "en" ? "Channels, addresses, and universes" : "Kanaler, adresser og univers";
  const universesGuideLabel = locale === "en" ? "How many DMX universes do you need?" : "Hvor mange DMX-univers trenger du?";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
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
  const structuredData = [faqSchema, howToSchema];

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
      canonicalPath={prefixLocale(locale, "/tools/dmx-capacity")}
      structuredData={structuredData}
      cta={
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <div className="space-y-4">
            <p className="text-title text-foreground">{tool.tool.cta.title}</p>
            <Link
              href={prefixLocale(locale, "/tools/dmx-patch-sheet")}
              className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {tool.tool.cta.link}
            </Link>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {locale === "en" ? "Related guides" : "Relaterte guider"}
              </p>
              <div className="space-y-1">
                <Link
                  href={prefixLocale(locale, channelsGuidePath)}
                  className="block text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {channelsGuideLabel}
                </Link>
                <Link
                  href={prefixLocale(locale, universesGuidePath)}
                  className="block text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {universesGuideLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ToolIntro title={tool.intro.title} body={tool.intro.body} />
      <ToolHowTo title={tool.howTo.title} steps={tool.howTo.steps} />
      <DmxCapacityTool />
      <ToolFaq title={tool.faq.title} items={tool.faq.items} />
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

function ToolFaq({
  title,
  items,
}: {
  title: string;
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-heading text-foreground">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <SectionCard key={item.question}>
            <div className="space-y-3">
              <p className="text-title text-foreground">{item.question}</p>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
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
