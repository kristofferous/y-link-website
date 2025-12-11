import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata = {
  title: "Om | Y-Link",
  description: "Kort om Y-Link og hvorfor vi bygger AI-drevet DMX.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          className="mt-2"
          items={[
            { label: "Hjem", href: "/" },
            { label: "Om" },
          ]}
        />

        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-800">
            Om Y-Link
          </p>
          <h1 className="text-3xl font-bold text-neutral-950">
            AI-drevet lyskontroll bygget for virkelige rom
          </h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Y-Link spesialiserer seg på fullautomatisk DMX-styring basert på musikkfiler.
            Målet er å levere et immersivt lydbilde og lysopplevelse med presis timing,
            uten at operatøren trenger å programmere showet manuelt.
          </p>
        </header>

        <SectionCard className="grid gap-8 p-9 md:grid-cols-2 md:gap-10">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Hvorfor vi bygger dette
            </h2>
            <p className="text-base leading-7 text-neutral-800">
              Vi ser behovet for pålitelig, musikkdrevet automasjon i miljøer der tempoet er høyt
              og bemanningen ofte er lav. Y-Link skal gi stabilitet som standard, samtidig som
              lyset følger musikken sømløst.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Hvem vi bygger for
            </h2>
            <p className="text-base leading-7 text-neutral-800">
              Faste venues som utesteder, russebusser og utleieoppsett. Fokus er klubber og små scener
              der lysopplevelsen skal holde tritt med musikken uten manuell programmering.
            </p>
          </div>
        </SectionCard>

        <SectionCard className="space-y-4 p-9">
          <h2 className="text-xl font-semibold text-neutral-900">Hvordan det fungerer</h2>
          <p className="text-base leading-7 text-neutral-800">
            Systemet analyserer musikkfiler og genererer lysløp automatisk. Et komplementerende
            kontroll-lag i iOS/iPadOS eller desktop gir mulighet til å justere og tilpasse live
            uten å bryte den automatiske flyten.
          </p>
          <p className="text-sm text-neutral-800">
            Vil du teste? Meld interesse på{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-neutral-800">
              forsiden
            </Link>
            , så tar vi kontakt.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
