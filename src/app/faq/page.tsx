import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";
import { StructuredData } from "@/components/StructuredData";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Vanlige spørsmål om Y-Link, AI DMX-kontrolleren, pilotprogrammet og e-postpreferanser.",
  alternates: {
    canonical: "/faq",
  },
};

const items = [
  {
    q: "Hva automatiserer AI-en?",
    a: "Kontrolleren analyserer lyd for tempo, fraser og energi. Den bygger cues, overganger og guardrails som følger låten uten manuell programmering.",
  },
  {
    q: "Kan operatører fortsatt styre riggen?",
    a: "Ja. Operatør kan godkjenne looks, låse intensitet, øve seksjoner og overstyre automasjon. Målet er forutsigbar avspilling med menneskelig kontroll.",
  },
  {
    q: "Hvordan håndteres latency?",
    a: "Hvert steg budsjettsettes, og avspilling valideres før output. Runtime er tunet for lav jitter i klubber og små scener.",
  },
  {
    q: "Hvilke fixtures og universer støttes?",
    a: "Vi retter oss mot vanlige DMX-universer med profiler for klubber og små venues. Universplanlegging og satureringssjekk kjøres før avspilling.",
  },
  {
    q: "Hvordan blir jeg med i pilot eller forhåndsbestilling?",
    a: "Bruk skjemaet på forsiden eller pilotsiden. Piloten er tidsbegrenset (ca. 4–8 uker), med utlån av Y1-hardware som returneres etterpå. Vi tar inn en liten, kurert gruppe for å teste stabilitet, timing og UX.",
  },
  {
    q: "Hvordan melder jeg meg av e-post?",
    a: "Hver e-post har en avmeldingslenke. Du kan også besøke /unsubscribe?token=<din-token> for å fjerne adressen umiddelbart.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
  url: absoluteUrl("/faq"),
};

export default function FAQPage() {
  return (
    <PageShell>
      <StructuredData data={faqSchema} />
      <div className="flex flex-col gap-12">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "FAQ" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">FAQ</p>
          <h1 className="text-3xl font-bold text-neutral-950">
            Svar om AI DMX-kontrolleren og pilotprogrammet
          </h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Få klarhet i hva som automatiseres, hvordan operatører har kontroll, og hvordan du melder deg på eller av.
          </p>
        </header>

        <SectionCard className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.q} className="space-y-2 rounded-2xl bg-white p-4 ring-1 ring-neutral-200">
                <p className="text-sm font-semibold text-neutral-900">{item.q}</p>
                <p className="text-sm leading-6 text-neutral-800">{item.a}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
