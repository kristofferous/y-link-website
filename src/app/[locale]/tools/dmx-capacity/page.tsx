import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage } from "@/components/ToolPage";
import { DmxCapacityTool } from "@/components/tools/DmxCapacityTool";
import { getDictionary, normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { prefixLocale } from "@/lib/i18n/routing";
import { getLanguageTag } from "@/lib/i18n/translator";

type DmxCapacityPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: DmxCapacityPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.tools.dmxCapacity.metadata.title,
    description: dictionary.tools.dmxCapacity.metadata.description,
    alternates: {
      canonical: prefixLocale(locale, "/tools/dmx-capacity"),
      languages: {
        "nb-NO": prefixLocale("nb", "/tools/dmx-capacity"),
        "en-US": prefixLocale("en", "/tools/dmx-capacity"),
      },
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
          </div>
        </div>
      }
    >
      <ToolIntro title={tool.intro.title} body={tool.intro.body} />
      <DmxCapacityTool />
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
