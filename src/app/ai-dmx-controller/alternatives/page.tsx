import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Alternativer til AI DMX-kontrolleren",
  description:
    "Sammenlign Y-Link med andre musikkreaktive og AI-drevne lysløsninger for å velge riktig verktøy.",
  alternates: {
    canonical: "/ai-dmx-controller/alternatives",
  },
};

const options = [
  {
    name: "Y-Link",
    focus: "AI-drevet, musikkreaktivt DMX med lav latency og guardrails for operatør.",
    bestFor: "Klubber, små scener og mobile rigs med liten bemanning.",
  },
  {
    name: "MaestroDMX",
    focus: "Lydanalyse og lysautomasjon for DJ-sett.",
    bestFor: "DJ-fokuserte oppsett der musikkcues styrer scenene.",
  },
  {
    name: "Lightkey (sound active)",
    focus: "Manuell programmering + lydtriggere på macOS.",
    bestFor: "Operatører som vil ha dyp manuell kontroll med enkel lydrespons.",
  },
  {
    name: "Onyx + tilleggsmoduler",
    focus: "Full konsoll med valgfrie lydtriggere.",
    bestFor: "Større rigger med dedikerte LD-er som likevel vil følge musikk.",
  },
];

const selectionCriteria = [
  "Latency og jitter under full last.",
  "Hvor tydelig guardrails er for operatør.",
  "Hvor raskt riggdata kan patches og valideres.",
  "Mulighet til å overstyre live uten at automasjon bryter sammen.",
];

export default function AlternativesPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "AI DMX-kontroller", href: "/ai-dmx-controller" },
            { label: "Alternativer" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Sammenligning</p>
          <h1 className="text-3xl font-bold text-neutral-950">Alternativer til Y-Link</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Bruk denne oversikten til å vurdere om du trenger AI-automasjon med guardrails, eller en mer tradisjonell
            konsoll med lydtriggere.
          </p>
        </header>

        <SectionCard className="grid gap-6 md:grid-cols-2">
          {options.map((opt) => (
            <div key={opt.name} className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]">
              <p className="text-sm font-semibold text-neutral-900">{opt.name}</p>
              <p className="text-sm leading-6 text-neutral-800">{opt.focus}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-700">{opt.bestFor}</p>
            </div>
          ))}
        </SectionCard>

        <SectionCard className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">Hva du bør vurdere</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            {selectionCriteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-neutral-800">
            Se også{" "}
            <Link href="/ai-dmx-controller/vs-maestrodmx" className="underline underline-offset-4 hover:text-neutral-900">
              Y-Link vs MaestroDMX
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
