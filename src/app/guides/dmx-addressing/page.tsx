import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Adresseering av fixtures",
  description: "Lær å adressere fixtures riktig for stabile AI-drevne lysløp.",
  alternates: {
    canonical: "/guides/dmx-addressing",
  },
};

export default function DMXAddressingPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Guider", href: "/guides" },
            { label: "Adresseering" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Guide</p>
          <h1 className="text-3xl font-bold text-neutral-950">Adresseering av fixtures</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Korrekt adressering gjør at AI-planlagte cues treffer riktig kanal hver gang.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Planlegg patch</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Hold en oppdatert patch-liste med startadresse og modus.</li>
            <li>Gruppér lignende fixtures for ryddige universer.</li>
            <li>Unngå overlapp ved å reservere buffersoner der riggen endres ofte.</li>
          </ul>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Valider mot kontroller</h2>
          <p className="text-base leading-7 text-neutral-800">
            Y-Link sjekker patchen før show. Uoverensstemmelser mellom patch og faktisk rigg kan føre til feil mapping og
            timingavvik.
          </p>
          <p className="text-sm text-neutral-800">
            Gå videre til{" "}
            <Link href="/guides/dmx-universes" className="underline underline-offset-4 hover:text-neutral-900">
              universer og skalering
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
