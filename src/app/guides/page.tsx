import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "DMX-guider",
  description: "Guider som bygger DMX-grunnlag og støtter AI-drevet, musikkreaktiv kontroll.",
  alternates: {
    canonical: "/guides",
  },
};

const guides = [
  { title: "DMX-grunnlag", href: "/guides/dmx-basics" },
  { title: "Adresseering av fixtures", href: "/guides/dmx-addressing" },
  { title: "Universer og skalering", href: "/guides/dmx-universes" },
  { title: "Latency og jitter", href: "/guides/dmx-latency-jitter" },
  { title: "Best practices", href: "/guides/dmx-best-practices" },
  { title: "Feilsøking", href: "/guides/dmx-troubleshooting" },
];

export default function GuidesPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Guider" },
          ]}
        />
        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Guider</p>
          <h1 className="text-3xl font-bold text-neutral-950">DMX-guider for AI-styrt kontroll</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Bygg et solid fundament slik at AI-basert DMX-automasjon lander sikkert i rommet ditt. Hver guide peker tilbake
            til hovedsiden for AI DMX-kontrolleren for mer kontekst.
          </p>
        </header>

        <SectionCard className="grid gap-6 md:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group space-y-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:shadow-[0_14px_40px_-26px_rgba(0,0,0,0.35)]"
            >
              <p className="text-sm font-semibold text-neutral-900 group-hover:underline">
                {guide.title}
              </p>
              <p className="label-text text-xs text-neutral-700">Les guide →</p>
            </Link>
          ))}
        </SectionCard>
      </div>
    </PageShell>
  );
}
