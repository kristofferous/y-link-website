import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "DMX-universer og skalering",
  description: "Slik planlegger du universer og skalerer riggen uten å miste timing.",
  alternates: {
    canonical: "/guides/dmx-universes",
  },
};

export default function DMXUniversesPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Guider", href: "/guides" },
            { label: "Universer og skalering" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Guide</p>
          <h1 className="text-3xl font-bold text-neutral-950">DMX-universer og skalering</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            God universplanlegging sikrer at AI-genererte signaler holder timing selv når riggen vokser.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Fordel lasten</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Hold universer under trygg utnyttelse; unngå å presse mot 512 på hektiske show.</li>
            <li>Fordel strømforbruk og kabelveier for å minimere støy og tap.</li>
            <li>Planlegg reserverte universer for midlertidige fixtures.</li>
          </ul>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Skalering</h2>
          <p className="text-base leading-7 text-neutral-800">
            Når du legger til universer, sørg for at kontrolleren og nodene støtter synkron klokke og overvåkning av
            latency. Y-Link håndhever timing per univers, men trenger korrekt topologi.
          </p>
          <p className="text-sm text-neutral-800">
            Les videre om{" "}
            <Link href="/guides/dmx-latency-jitter" className="underline underline-offset-4 hover:text-neutral-900">
              latency og jitter
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
