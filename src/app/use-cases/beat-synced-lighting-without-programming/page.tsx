import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Beat-synket lys uten programmering",
  description: "Last opp spor, valider timing og kjør show raskt med Y-Link og guardrails.",
  alternates: {
    canonical: "/use-cases/beat-synced-lighting-without-programming",
  },
};

export default function BeatSyncedLightingPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Bruksscenarier", href: "/use-cases" },
            { label: "Beat-synket lys" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Bruksscenario</p>
          <h1 className="text-3xl font-bold text-neutral-950">Beat-synket lys uten programmering</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Y-Link analyserer tempo, fraser og energi i sporene dine, genererer lysløp og låser timing før output. Du
            slipper å programmere manuelt, men kan fortsatt overstyre live.
          </p>
        </header>

        <SectionCard className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Opplasting eller live-feed",
              body: "Importer spillelister eller koble live-lyd. Systemet henter strukturen automatisk.",
            },
            {
              title: "Preflight før show",
              body: "Timing, jitter og saturering sjekkes før output. Guardrails settes per rigg.",
            },
            {
              title: "Live-justering",
              body: "Endre intensitet og looks uten å miste låst timing.",
            },
            {
              title: "Rask gjennomføring",
              body: "Ferdig til show uten å bygge cue-by-cue, men fortsatt med kontrollflater for operatør.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]"
            >
              <h2 className="text-base font-semibold text-neutral-900">{item.title}</h2>
              <p className="text-sm leading-6 text-neutral-800">{item.body}</p>
            </div>
          ))}
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Start raskt</h2>
          <ol className="list-decimal space-y-2 pl-5 text-base leading-7 text-neutral-800">
            <li>Del riggdata og universer.</li>
            <li>Last opp spor eller koble til lydkilde.</li>
            <li>Kjør preflight og lås timing.</li>
            <li>Merk hvor operatør kan overstyre.</li>
            <li>Gå live med overvåkning.</li>
          </ol>
          <p className="text-sm text-neutral-800">
            Mer info? Les{" "}
            <Link href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-900">
              hvordan systemet fungerer
            </Link>{" "}
            eller{" "}
            <Link href="/pilot" className="underline underline-offset-4 hover:text-neutral-900">
              søk pilot
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
