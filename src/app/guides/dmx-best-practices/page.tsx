import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Beste praksis for DMX",
  description: "Praktiske tips for stabile DMX-rigger når AI styrer lysløpene.",
  alternates: {
    canonical: "/guides/dmx-best-practices",
  },
};

export default function DMXBestPracticesPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Guider", href: "/guides" },
            { label: "Beste praksis" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Guide</p>
          <h1 className="text-3xl font-bold text-neutral-950">Beste praksis for DMX</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Rutiner som holder timing stabil og guardrails effektive når AI styrer lysene.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Før show</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Verifiser patch og universer mot riggen.</li>
            <li>Kjør preflight på latency, jitter og saturering.</li>
            <li>Definer operatør-override og nødsituasjoner.</li>
          </ul>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Under show</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Hold nettverk og noder under observasjon.</li>
            <li>Bruk guardrails i stedet for manuelle hopp når det er mulig.</li>
            <li>Logg avvik for senere justering.</li>
          </ul>
          <p className="text-sm text-neutral-800">
            Se også{" "}
            <Link href="/guides/dmx-troubleshooting" className="underline underline-offset-4 hover:text-neutral-900">
              feilsøking
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
