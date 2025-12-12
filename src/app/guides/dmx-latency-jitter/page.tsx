import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Latency og jitter i DMX",
  description: "Hvordan måle og kontrollere latency og jitter i en AI-styrt DMX-rigg.",
  alternates: {
    canonical: "/guides/dmx-latency-jitter",
  },
};

export default function DMXLatencyJitterPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Guider", href: "/guides" },
            { label: "Latency og jitter" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Guide</p>
          <h1 className="text-3xl font-bold text-neutral-950">Latency og jitter i DMX</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Timing er kjerneverdien i musikkreaktivt lys. Her er hvordan vi måler, budsjettsetter og overvåker latency og
            jitter.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Måling</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Mål ende-til-ende-latency med kjent testlyd og sensor på lys.</li>
            <li>Se etter jitter (variasjon) mellom cues og output.</li>
            <li>Logg under full belastning, ikke bare i tomt rom.</li>
          </ul>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Kontroll</h2>
          <p className="text-base leading-7 text-neutral-800">
            Y-Link budsjettsetter hvert steg og overvåker drift. Oppdages avvik, strammes output eller operatør varsles.
            Hold nettverk og noder stabile for best resultat.
          </p>
          <p className="text-sm text-neutral-800">
            Relatert lesing:{" "}
            <Link href="/guides/dmx-best-practices" className="underline underline-offset-4 hover:text-neutral-900">
              beste praksis
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
