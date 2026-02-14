import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/ToolPage";
import { DmxAddressPlannerTool } from "@/components/tools/DmxAddressPlannerTool";
import { SectionCard } from "@/components/SectionCard";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getLanguageTag } from "@/lib/i18n/translator";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type DmxAddressPlannerPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: DmxAddressPlannerPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const canonicalPath = prefixLocale(locale, "/tools/dmx-address-planner");
  const ogAlt = dictionary.meta?.ogAlt ?? "Y-Link";

  return {
    title: dictionary.tools.dmxAddressPlanner.metadata.title,
    description: dictionary.tools.dmxAddressPlanner.metadata.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "nb-NO": prefixLocale("nb", "/tools/dmx-address-planner"),
        "en-US": prefixLocale("en", "/tools/dmx-address-planner"),
      },
    },
    openGraph: {
      title: dictionary.tools.dmxAddressPlanner.metadata.title,
      description: dictionary.tools.dmxAddressPlanner.metadata.description,
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
      title: dictionary.tools.dmxAddressPlanner.metadata.title,
      description: dictionary.tools.dmxAddressPlanner.metadata.description,
      images: [defaultOgImage],
    },
  };
}

export default async function DmxAddressPlannerPage({ params }: DmxAddressPlannerPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const lang = getLanguageTag(locale);
  const { tools, navigation } = dictionary;
  const tool = tools.dmxAddressPlanner;
  const dipGuidePath = "/guides/dmx-dip-switch-addressing";
  const patchGuidePath = "/guides/dmx-patch-lists-channel-planning";
  const dipGuideLabel = locale === "en" ? "DMX DIP switch addressing" : "DMX DIP-bryter adressering";
  const patchGuideLabel = locale === "en" ? "DMX patch lists and channel planning" : "DMX patchlister og kanalplanlegging";

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
      canonicalPath={prefixLocale(locale, "/tools/dmx-address-planner")}
      structuredData={structuredData}
      cta={
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <div className="space-y-4">
            <p className="text-title text-foreground">{tool.cta.title}</p>
            <p className="text-sm text-muted-foreground">{tool.cta.body}</p>
            <Link
              href={prefixLocale(locale, "/tools/dmx-patch-sheet")}
              className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {tool.cta.link}
            </Link>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {locale === "en" ? "Related guides" : "Relaterte guider"}
              </p>
              <div className="space-y-1">
                <Link
                  href={prefixLocale(locale, dipGuidePath)}
                  className="block text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {dipGuideLabel}
                </Link>
                <Link
                  href={prefixLocale(locale, patchGuidePath)}
                  className="block text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {patchGuideLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ToolIntro title={tool.intro.title} body={tool.intro.body} />
      <ToolHowTo title={tool.howTo.title} steps={tool.howTo.steps} />
      <DmxAddressPlannerTool />
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
