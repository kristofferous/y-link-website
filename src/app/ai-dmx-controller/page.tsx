import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "AI DMX-kontroller",
  description:
    "Y-Link er en AI-drevet DMX-kontroller som gjør lyd om til forutsigbare, musikkstyrte lysløp med lav latency.",
  alternates: {
    canonical: "/ai-dmx-controller",
  },
};

export default function AIDMXControllerPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "AI DMX-kontroller" },
          ]}
        />

        <header className="space-y-4">
          <p className="label-text text-sm text-neutral-800">Produkt</p>
          <h1 className="text-4xl font-bold leading-tight text-neutral-950 sm:text-5xl">
            AI DMX-kontroller for musikkreaktivt lys
          </h1>
          <p className="max-w-4xl text-lg leading-8 text-neutral-800">
            Y-Link konverterer lyd til lysløp som følger tempo, frasering og energi. Lav latency, guardrails og
            operatørkontroll gjør at showet er forutsigbart, ikke tilfeldig.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-neutral-800">
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-white">AI DMX-kontroller</span>
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200">Musikkreaktiv</span>
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200">Lav latency</span>
          </div>
        </header>

        <SectionCard className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-neutral-950">Hvordan det fungerer</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Lyd inn",
                body: "Last opp musikk eller bruk live lyd. Systemet fanger tempo, fraser og energi.",
              },
              {
                title: "Planlegging",
                body: "AI planlegger cues, overganger og sikkerhetsgrenser tilpasset riggen din.",
              },
              {
                title: "Deterministisk avspilling",
                body: "Signaler tidssettes og overvåkes før output. Latency-budsjett håndheves live.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]"
              >
                <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
                <p className="text-sm leading-6 text-neutral-800">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Hvem det er for</h2>
            <ul className="space-y-2 text-base leading-7 text-neutral-800">
              <li>Klubber og barer som vil ha musikkreaktivt lys uten manuell programmering.</li>
              <li>Små scener og installasjoner med liten bemanning men krav til timing.</li>
              <li>Mobile rigs som trenger raske load-ins og forutsigbar avspilling.</li>
              <li>Operatører som vil ha guardrails og mulighet til å overstyre når som helst.</li>
            </ul>
            <p className="text-sm text-neutral-800">
              Se også{" "}
              <Link href="/use-cases/music-reactive-dmx-clubs" className="underline underline-offset-4 hover:text-neutral-800">
                bruk i klubb
              </Link>{" "}
              eller{" "}
              <Link href="/use-cases/automated-dmx-small-venues" className="underline underline-offset-4 hover:text-neutral-800">
                automatisering for små scener
              </Link>
              .
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-[#f3f4fb] p-6">
            <h3 className="text-base font-semibold text-neutral-900">Oppsett og krav</h3>
            <ul className="space-y-2 text-sm leading-6 text-neutral-800">
              <li>Lydopplasting eller live feed.</li>
              <li>Fixture-liste og univers for planlegging og sikkerhet.</li>
              <li>Nettverk for oppdateringer og fjernovervåkning.</li>
              <li>Operatørflate (desktop eller iPad) for godkjenninger og overstyring.</li>
            </ul>
            <p className="text-sm leading-6 text-neutral-800">
              Timing og saturering valideres før show slik at øving matcher live.
            </p>
          </div>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Neste steg</h2>
          <p className="text-base leading-7 text-neutral-800">
            Trenger du musikkreaktivt lys med forutsigbar timing? Bli med i piloten, så dokumenterer vi latency i din
            rigg og finjusterer guardrails.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-neutral-900">
            <Link href="/pilot" className="rounded-full bg-neutral-900 px-3 py-2 font-semibold text-white hover:bg-neutral-800">
              Søk pilot
            </Link>
            <Link href="/guides/dmx-latency-jitter" className="font-semibold underline underline-offset-4 hover:text-neutral-700">
              Les om latency og jitter
            </Link>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
