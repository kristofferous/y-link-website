import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "DMX-grunnlag",
  description: "Forstå DMX-signaler, universer og fixture-styring som grunnlag for AI-drevet lys.",
  alternates: {
    canonical: "/guides/dmx-basics",
  },
};

export default function DMXBasicsPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Guider", href: "/guides" },
            { label: "DMX-grunnlag" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Guide</p>
          <h1 className="text-3xl font-bold text-neutral-950">DMX-grunnlag</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            En kort innføring i DMX slik at fixture-planleggingen din passer med AI-genererte cues fra Y-Link-kontrolleren.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Signal og univers</h2>
          <p className="text-base leading-7 text-neutral-800">
            DMX512 sender 512 kanalverdier per univers. Hver fixture bruker kanaler basert på valgt modus. Forutsigbar
            automasjon krever tydelig mapping av fixtures til universer og oversikt over kanalbruk.
          </p>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Kartlegg alle fixtures med adresse og kanalfotavtrykk.</li>
            <li>Hold universer under trygg utnyttelse for å unngå timing-problemer.</li>
            <li>Dokumenter kabling, splittere og noder.</li>
          </ul>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Fixture-moduser</h2>
          <p className="text-base leading-7 text-neutral-800">
            Velg moduser som balanserer kontroll mot kanaltall. Høye moduser gir mer kontroll, men bruker flere kanaler.
            AI-planleggeren trenger korrekt patch for å unngå saturering.
          </p>
          <p className="text-sm text-neutral-800">
            Fortsett med{" "}
            <Link href="/guides/dmx-addressing" className="underline underline-offset-4 hover:text-neutral-900">
              adressering av fixtures
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
