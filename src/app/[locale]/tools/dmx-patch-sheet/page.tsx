import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/ToolPage";
import { DmxPatchSheetTool } from "@/components/tools/DmxPatchSheetTool";
import { SectionCard } from "@/components/SectionCard";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getLanguageTag } from "@/lib/i18n/translator";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";

type DmxPatchSheetPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

type ToolIntroData = {
  eyebrow: string;
  title: string;
  body: string;
  overlapsTitle: string;
  overlapsBody: string;
  audienceTitle: string;
  audienceItems: string[];
};

type ToolDetailsData = {
  title: string;
  sections: Array<{
    title: string;
    body?: string;
    items?: string[];
    linkLabel?: string;
    linkHref?: string;
  }>;
};

type ToolHowToData = {
  title: string;
  steps: string[];
};

type ToolFaqData = {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

type ToolLimitationsData = {
  title: string;
  intro: string;
  items: string[];
  outro: string;
};

type ToolAddressNoteData = {
  title: string;
  body: string;
};

type ToolProCtaData = {
  title: string;
  body: string;
  linkLabel: string;
  linkHref: string;
};

export async function generateMetadata({ params }: DmxPatchSheetPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const canonicalPath = prefixLocale(locale, "/tools/dmx-patch-sheet");
  const ogAlt = dictionary.meta?.ogAlt ?? "Y-Link";

  return {
    title: dictionary.tools.dmxPatch.metadata.title,
    description: dictionary.tools.dmxPatch.metadata.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "nb-NO": prefixLocale("nb", "/tools/dmx-patch-sheet"),
        "en-US": prefixLocale("en", "/tools/dmx-patch-sheet"),
        "x-default": prefixLocale("en", "/tools/dmx-patch-sheet"),
      },
    },
    openGraph: {
      title: dictionary.tools.dmxPatch.metadata.title,
      description: dictionary.tools.dmxPatch.metadata.description,
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
      title: dictionary.tools.dmxPatch.metadata.title,
      description: dictionary.tools.dmxPatch.metadata.description,
      images: [defaultOgImage],
    },
  };
}

export default async function DmxPatchSheetPage({ params }: DmxPatchSheetPageProps) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);
  const lang = getLanguageTag(locale);
  const { tools, navigation } = dictionary;
  const tool = tools.dmxPatch;
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
      canonicalPath={prefixLocale(locale, "/tools/dmx-patch-sheet")}
      structuredData={structuredData}
      cta={
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <div className="space-y-4">
            <p className="text-title text-foreground">{tool.cta.title}</p>
            <p className="text-sm text-muted-foreground">{tool.cta.body}</p>
            <Link
              href={prefixLocale(locale, "/tools")}
              className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {tool.cta.link}
            </Link>
          </div>
        </div>
      }
    >
      <ToolIntro data={tool.intro} />
      <ToolHowTo data={tool.howTo} />
      <DmxPatchSheetTool />
      <ToolAddressNote data={tool.addressNote} />
      <ToolFaq data={tool.faq} />
      <ToolLimitations data={tool.limitations} />
      <ToolDetails data={tool.details} locale={locale} />
      <ToolProCta data={tool.proCta} locale={locale} />
    </ToolPage>
  );
}

function ToolIntro({ data }: { data: ToolIntroData }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <h2 className="text-heading text-foreground">{data.title}</h2>
        <p className="text-body text-muted-foreground">{data.body}</p>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{data.overlapsTitle}</p>
          <p className="text-body text-muted-foreground">{data.overlapsBody}</p>
        </div>
      </div>
      <div className="rounded-lg border border-border/40 bg-card p-6">
        <p className="text-sm font-semibold text-foreground">{data.audienceTitle}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {data.audienceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ToolDetails({ data, locale }: { data: ToolDetailsData; locale: AppLocale }) {
  return (
    <div className="space-y-6">
      <h2 className="text-heading text-foreground">{data.title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {data.sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-border/40 bg-card p-6">
            <div className="space-y-3">
              <p className="text-title text-foreground">{section.title}</p>
              {section.body ? <p className="text-sm text-muted-foreground">{section.body}</p> : null}
              {section.items ? (
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.linkLabel && section.linkHref ? (
                <Link
                  href={
                    section.linkHref.startsWith("/guides/")
                      ? section.linkHref
                      : prefixLocale(locale, section.linkHref)
                  }
                  className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  {section.linkLabel}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolHowTo({ data }: { data: ToolHowToData }) {
  return (
    <SectionCard>
      <div className="space-y-4">
        <p className="text-title text-foreground">{data.title}</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          {data.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </SectionCard>
  );
}

function ToolFaq({ data }: { data: ToolFaqData }) {
  return (
    <div className="space-y-6">
      <h2 className="text-heading text-foreground">{data.title}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {data.items.map((item) => (
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

function ToolLimitations({ data }: { data: ToolLimitationsData }) {
  return (
    <SectionCard>
      <div className="space-y-4">
        <p className="text-title text-foreground">{data.title}</p>
        <p className="text-sm text-muted-foreground">{data.intro}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">{data.outro}</p>
      </div>
    </SectionCard>
  );
}

function ToolAddressNote({ data }: { data: ToolAddressNoteData }) {
  return (
    <SectionCard>
      <div className="space-y-3">
        <p className="text-title text-foreground">{data.title}</p>
        <p className="text-sm text-muted-foreground">{data.body}</p>
      </div>
    </SectionCard>
  );
}

function ToolProCta({ data, locale }: { data: ToolProCtaData; locale: AppLocale }) {
  return (
    <SectionCard>
      <div className="space-y-3">
        <p className="text-title text-foreground">{data.title}</p>
        <p className="text-sm text-muted-foreground">{data.body}</p>
        <Link
          href={prefixLocale(locale, data.linkHref)}
          className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
        >
          {data.linkLabel}
        </Link>
      </div>
    </SectionCard>
  );
}
