import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Feilsøking i DMX",
  description: "Vanlige feil i DMX-rigger og hvordan du løser dem når AI driver lysløpene.",
  alternates: {
    canonical: "/guides/dmx-troubleshooting",
  },
};

export default function DMXTroubleshootingPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Guider", href: "/guides" },
            { label: "Feilsøking" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Guide</p>
          <h1 className="text-3xl font-bold text-neutral-950">Feilsøking i DMX</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Typiske problemer og raske tiltak for å holde showet stabilt.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Vanlige feil</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Drops i signal: sjekk kabler, terminering og noder.</li>
            <li>Feil mapping: verifiser patch og adressering.</li>
            <li>Timingglipp: se etter nettverkslast og nodehelse.</li>
          </ul>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Rask sjekkliste</h2>
          <ol className="list-decimal space-y-2 pl-5 text-base leading-7 text-neutral-800">
            <li>Bekreft univers- og adressetildeling.</li>
            <li>Sjekk at guardrails og sikkerhetsgrenser er aktive.</li>
            <li>Restart noder ved feiltilstand, logg hendelsen.</li>
          </ol>
          <p className="text-sm text-neutral-800">
            Trenger du grunnleggende? Start med{" "}
            <Link href="/guides/dmx-basics" className="underline underline-offset-4 hover:text-neutral-900">
              DMX-grunnlag
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
