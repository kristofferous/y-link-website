import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/ToolPage";
import { DmxPatchSheetTool } from "@/components/tools/DmxPatchSheetTool";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getLanguageTag } from "@/lib/i18n/translator";

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
  }>;
};

export async function generateMetadata({ params }: DmxPatchSheetPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.tools.dmxPatch.metadata.title,
    description: dictionary.tools.dmxPatch.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/tools/dmx-patch-sheet"),
      languages: {
        "nb-NO": prefixLocale("nb", "/tools/dmx-patch-sheet"),
        "en-US": prefixLocale("en", "/tools/dmx-patch-sheet"),
      },
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
      <DmxPatchSheetTool />
      <ToolDetails data={tool.details} />
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

function ToolDetails({ data }: { data: ToolDetailsData }) {
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
