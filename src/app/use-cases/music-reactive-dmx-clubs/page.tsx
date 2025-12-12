import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Musikkreaktivt DMX-lys for klubber",
  description: "Hold klubblyset synkronisert med hvert spor med Y-Link AI DMX-kontrolleren.",
  alternates: {
    canonical: "/use-cases/music-reactive-dmx-clubs",
  },
};

export default function MusicReactiveClubsPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Bruksscenarier", href: "/use-cases" },
            { label: "Musikkreaktive klubber" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Bruksscenario</p>
          <h1 className="text-3xl font-bold text-neutral-950">Musikkreaktivt DMX-lys for klubber</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Lever et stramt, musikkstyrt show uten å programmere hver låt for hånd. Y-Link analyserer lyd og styrer DMX
            med lav latency, slik at operatøren kan følge rommet i stedet for konsollen.
          </p>
        </header>

        <SectionCard className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Lydstyrte cues",
              body: "Last opp spillelister eller bruk en live-miks. Kontrolleren følger tempo, frasering og energi.",
            },
            {
              title: "Forutsigbar timing",
              body: "Latency-budsjett overvåkes. Ingen overraskelser når rommet fylles og lasten endres.",
            },
            {
              title: "Guardrails for operatør",
              body: "Grenser for intensitet, blackout-regler og godkjenninger holder riggen trygg.",
            },
            {
              title: "Raske bytter",
              body: "Repertoar kan øves, cues låses og spillelister byttes raskt mellom DJs.",
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
          <h2 className="text-xl font-semibold text-neutral-900">Slik setter du opp i klubb</h2>
          <ol className="list-decimal space-y-2 pl-5 text-base leading-7 text-neutral-800">
            <li>Del fixture-liste, universoppsett og rombegrensninger.</li>
            <li>Last opp en start-spilleliste eller koble live lyd.</li>
            <li>Kjør preflight for timing, saturering og sikkerhetsgrenser.</li>
            <li>Øv deler, lås viktige looks og sett operatør-override.</li>
            <li>Gå live med overvåkning; juster intensitet eller looks ved behov.</li>
          </ol>
          <p className="text-sm text-neutral-800">
            Trenger du mer dybde? Les{" "}
            <Link href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-900">
              hovedsiden for AI DMX-kontrolleren
            </Link>{" "}
            eller{" "}
            <Link href="/ai-dmx-controller/alternatives" className="underline underline-offset-4 hover:text-neutral-900">
              sammenlign alternativer
            </Link>
            .
          </p>
        </SectionCard>

        <SectionCard className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">Neste steg</h2>
          <p className="text-base leading-7 text-neutral-800">
            Hvis du trenger musikkreaktivt lys med forutsigbar timing, bli med i piloten. Vi validerer timing i ditt rom
            og justerer guardrails til riggen din.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-neutral-900">
            <Link href="/pilot" className="rounded-full bg-neutral-900 px-3 py-2 font-semibold text-white hover:bg-neutral-800">
              Søk pilot
            </Link>
            <Link href="/guides/dmx-latency-jitter" className="font-semibold underline underline-offset-4 hover:text-neutral-700">
              Les guiden om latency og jitter
            </Link>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
