import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Bruksscenarier",
  description: "Se hvordan Y-Link passer for klubber, små scener og team som vil automatisere lys uten å miste kontroll.",
  alternates: {
    canonical: "/use-cases",
  },
};

const useCases = [
  {
    title: "Musikkreaktivt DMX-lys for klubber",
    href: "/use-cases/music-reactive-dmx-clubs",
    detail: "Hold dansegulvet synkronisert med lydkilden med forutsigbar timing.",
  },
  {
    title: "Automatisert DMX for små scener",
    href: "/use-cases/automated-dmx-small-venues",
    detail: "Mindre manuell programmering, samme uttrykk kveld etter kveld.",
  },
  {
    title: "Beat-synket lys uten programmering",
    href: "/use-cases/beat-synced-lighting-without-programming",
    detail: "Last opp låter, verifiser timing og gå live raskt med guardrails.",
  },
];

export default function UseCasesPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Bruksscenarier" },
          ]}
        />
        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Bruk</p>
          <h1 className="text-3xl font-bold text-neutral-950">Hvor Y-Link passer best</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Musikkreaktiv automasjon, lav latency og mulighet for operatør-override gjør Y-Link egnet der bemanningen er
            slank og timing er kritisk.
          </p>
        </header>

        <SectionCard className="grid gap-6 md:grid-cols-3">
          {useCases.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)]"
            >
              <p className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-950">{item.title}</p>
              <p className="text-sm leading-6 text-neutral-800">{item.detail}</p>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-700">Les mer →</span>
            </Link>
          ))}
        </SectionCard>
      </div>
    </PageShell>
  );
}
