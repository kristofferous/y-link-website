import Link from "next/link";
import { InterestForm } from "@/components/InterestForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export default function Home() {
  return (
    <PageShell>
      <div className="flex flex-col gap-16">
        <header className="space-y-6">
          <Breadcrumbs items={[{ label: "Hjem" }]} />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-800 ring-1 ring-neutral-200">
              Y-Link
            </span>
            <span className="text-sm text-neutral-800">
              Presisjon. Forutsigbarhet. Fremdrift.
            </span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-neutral-950 sm:text-5xl">
              AI-drevet DMX-styring med stabilitet som standard.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-neutral-800">
              Y-Link kombinerer dedikert kontroller-hardware med et moderne
              operativt lag for stabil, lav-latens DMX-styring. Systemet er
              designet for fullautomatisk lyskjøring basert på musikkfiler, der
              AI planlegger og leverer et immersivt show med presis timing.
            </p>
          </div>
        </header>

        <SectionCard className="space-y-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-neutral-950">Hva som skiller Y-Link</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Forutsigbar sanntid",
                body:
                  "DMX-signalgang uten overraskelser. Stram kontrollsløyfe mellom controller og programvare for stabile leveranser.",
              },
              {
                title: "Musikkdrevet automasjon",
                body:
                  "AI analyserer musikkfiler og genererer lysløp som følger struktur, dynamikk og stemning – klar for avspilling uten manuell programmering.",
              },
              {
                title: "Robust i drift",
                body:
                  "Bygget for faste installasjoner og mobile rigg, med lav kompleksitet for operatøren og høy toleranse for endringer.",
              },
              {
                title: "Immersiv opplevelse",
                body:
                  "Automatiserte cues og overganger som bygger opp scenen organisk. Fokus på flyt, helhet og trygg leveranse kveld etter kveld.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="space-y-2 rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-neutral-50 px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]"
              >
                <h3 className="text-base font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-neutral-800">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <section className="space-y-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-neutral-950">Intelligente arbeidsflyter</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          </div>
          <SectionCard className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <p className="text-base leading-7 text-neutral-800">
                Y-Link utforsker fullautomatisert lysdesign basert på musikkfiler,
                der AI analyserer tempo, struktur og dynamikk for å levere
                synkronisert DMX uten manuell innprogrammering.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "AI-genererte cues fra musikkfiler",
                  "Automatiserte sjekker for tryggere kjøring",
                  "Løpende analyse av timing og respons",
                  "Forslag til optimalisering underveis",
                ].map((line) => (
                  <div
                    key={line}
                    className="rounded-xl border border-neutral-200/80 bg-neutral-50 px-3 py-2 text-sm text-neutral-800"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-[#f3f4fb] p-6">
              <h3 className="text-base font-semibold text-neutral-900">
                Modernisert operatørverktøy
              </h3>
              <p className="text-sm leading-6 text-neutral-800">
                Moderne arbeidsflate som prioriterer hastighet og tydelighet.
                Fokus på sikre handlinger, raske revisjoner og lav kognitiv
                belastning når tempoet øker. Full automasjon betyr færre manuelle
                grep, men tydelige kontroller når du vil justere.
              </p>
              <p className="text-sm leading-6 text-neutral-800">
                AI-assistert støtte brukes for å verifisere, kalibrere og sikre
                kvalitet. Operatøren kan overstyre ved behov, men målet er trygg
                autonom drift.
              </p>
            </div>
          </SectionCard>
        </section>

        <SectionCard className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950">Hvem det er for</h2>
              <ul className="space-y-2 text-base leading-7 text-neutral-800">
                <li>- scener og konsertsaler</li>
                <li>- live-arrangementer</li>
                <li>- tekniske operatører</li>
                <li>- avanserte brukere</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-950">ALPINE</h2>
              <p className="text-base leading-7 text-neutral-800">
                ALPINE er kommunikasjonsryggraden i Y-Link. Den er laget for
                streng autentisering og forutsigbar sanntidsoppførsel, slik at
                styresignaler leveres presist uten støy eller usikkerhet.
              </p>
              <p className="text-sm text-neutral-800">
                Les mer om hvordan vi håndterer data i{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-neutral-800"
                >
                  personvernnotatet
                </Link>
                .
              </p>
            </div>
          </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="mb-6 space-y-2">
              <h3 className="text-lg font-semibold text-neutral-950">Meld interesse</h3>
              <p className="text-sm leading-6 text-neutral-900">
                Vi samler et begrenset antall tidlige brukere til pilot,
                forhåndsbestilling og dialog. Ingen unødvendig støy.
              </p>
            </div>
            <InterestForm />
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
