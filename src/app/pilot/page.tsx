import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InterestForm } from "@/components/InterestForm";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata = {
  title: "Pilot | Y-Link",
  description: "Meld interesse for pilot og tidlig tilgang.",
};

export default function PilotPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Pilot" },
          ]}
        />

        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-800">
            Pilot
          </p>
          <h1 className="text-3xl font-bold text-neutral-950">
            Meld interesse for pilot
          </h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Vi tar inn et begrenset antall piloter. Fokus er AI-drevet, musikkbasert DMX
            for klubber, små scener, utesteder, russebusser og utleieoppsett.
          </p>
        </header>

        <SectionCard className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">Hva vi ser etter</h2>
            <ul className="space-y-2 text-base leading-7 text-neutral-800">
              <li>- Miljøer der musikken styrer lysopplevelsen</li>
              <li>- Vilje til å teste fullautomatisk kjøring fra musikkfiler</li>
              <li>- Klubber, små scener, utesteder, russebusser, utleie</li>
            </ul>
            <p className="text-base leading-7 text-neutral-800">
              Antall plasser er ikke fastsatt. Meld deg på, så tar vi kontakt når vi åpner neste runde.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="mb-6 space-y-2">
              <h3 className="text-lg font-semibold">Påmelding</h3>
              <p className="text-sm leading-6 text-neutral-800">
                Skjemaet er forhåndsvalgt til pilot. Ingen unødvendig støy.
              </p>
            </div>
            <InterestForm defaultInterest="Pilot / early access" />
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
