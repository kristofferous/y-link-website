import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InterestCtaButton } from "@/components/InterestCtaButton";
import { InterestSignup } from "@/components/InterestSignup";
import { PageShell } from "@/components/PageShell";

export default function Home() {
  return (
    <PageShell spacingClass="gap-8 py-10">
      <div className="flex flex-col gap-8">
        <header className="section-block space-y-6">
          <Breadcrumbs items={[{ label: "Hjem" }]} />
          <div className="space-y-4">
            <p className="label-text text-sm text-neutral-800">
              AI-drevet DMX-kontroller
            </p>
            <h1 className="heading-max text-4xl font-bold leading-tight text-neutral-950 sm:text-5xl clamp-2">
              AI-drevet DMX-kontroller for musikkdrevne venues
            </h1>
            <p className="content-max text-lg leading-8 text-neutral-800 clamp-3">
              Y-Link gjør musikken om til presise lysløp med stabil timing og guardrails for live-bruk. Laget for klubber,
              små scener og mobile oppsett der bemanning er begrenset og showet må sitte.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <InterestCtaButton
                context="hero"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
              >
                Meld interesse
              </InterestCtaButton>
              <a
                className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
                href="#hvordan"
              >
                Hvordan det fungerer
              </a>
              <Link
                className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
                href="/use-cases"
              >
                Se bruksscenarier
              </Link>
            </div>
            <ul className="flex flex-wrap gap-3 text-sm text-neutral-800">
              <li className="rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200">
                Automatisk show – uten manuell programmering
              </li>
              <li className="rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200">
                Stabil timing og forutsigbar drift
              </li>
              <li className="rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200">
                Live-justering uten å ødelegge automasjonen
              </li>
            </ul>
          </div>
        </header>

        <div className="section-block">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div className="space-y-4">
              <p className="label-text text-sm font-semibold text-neutral-900">Hvorfor Y-Link</p>
              <h2 className="heading-max text-2xl font-semibold leading-tight text-neutral-950 clamp-2">
                Lys som følger tempoet, uten å kreve et helt crew
              </h2>
              <p className="content-max text-base leading-7 text-neutral-800">
                Y-Link prioriterer flyt: kort vei fra musikk til ferdige cues, stabil timing og færre manuelle inngrep.
                Du får en tydelig historie om hvordan systemet skiller seg ut, ikke en vegg av like kort.
              </p>
              <div className="flex flex-wrap gap-2 text-sm font-semibold text-neutral-900">
                {["Stabile automasjoner", "Lite bemanning", "Raskt oppsett", "Forutsigbar live-kontroll"].map(
                  (item) => (
                    <span key={item} className="rounded-full bg-neutral-900 px-3 py-1 text-white">
                      {item}
                    </span>
                  ),
                )}
              </div>
              <p className="content-max text-sm text-neutral-800">
                Målet er å gjøre solide lysløp til standard – ikke et sideprosjekt.
              </p>
            </div>
            <div className="space-y-4 rounded-3xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
              <p className="text-sm font-semibold text-neutral-900">Bygget for liten margin</p>
              <div className="space-y-3 text-sm leading-6 text-neutral-800">
                <div className="flex gap-3">
                  <div className="mt-2 h-1.5 w-10 rounded-full bg-neutral-900" />
                  <p>Automatiske lysløp følger musikken og holder timing selv når riggen er enkel.</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-2 h-1.5 w-10 rounded-full bg-neutral-900" />
                  <p>Guardrails hindrer tilfeldige hopp – live-justeringer holder seg innenfor planlagt uttrykk.</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-2 h-1.5 w-10 rounded-full bg-neutral-900" />
                  <p>Raskt oppsett for klubber, små scener og mobile rigs uten dedikert lysoperatør.</p>
                </div>
              </div>
              <Link
                href="/use-cases"
                className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
              >
                Se bruksscenarier
              </Link>
            </div>
          </div>
        </div>

        <div className="section-block" id="hvordan">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="label-text text-sm font-semibold text-neutral-900">Hvordan det fungerer</p>
              <h2 className="heading-max text-2xl font-semibold leading-tight text-neutral-950 clamp-2">
                Fra lydkilde til lysløp uten manuell programmering
              </h2>
              <p className="content-max text-base leading-7 text-neutral-800">
                En kort kjede med tydelige steg: du ser hva som skjer, hvorfor det skjer, og hvor du kan justere live.
              </p>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
              <div className="space-y-4 rounded-3xl bg-neutral-900 p-6 text-white shadow-[0_16px_50px_-36px_rgba(0,0,0,0.5)] ring-1 ring-neutral-800">
                <p className="text-sm font-semibold text-white">Guardrails i live-modus</p>
                <ul className="space-y-3 text-sm leading-6 text-white/80">
                  <li>Timing låses til musikken slik at overganger ikke sklir.</li>
                  <li>Automatiske fades og energi-mapping hindrer tilfeldige effekter.</li>
                  <li>Operatør kan overstyre – systemet holder struktur og tempo.</li>
                </ul>
              </div>
              <ol className="relative space-y-6 border-l border-neutral-200 pl-5">
                {[
                  {
                    title: "Velg eller importer musikk",
                    label: "Steg 1",
                    body: "Importer spillelister eller bruk live lyd. Systemet henter tempo, fraser og energi som grunnlag.",
                  },
                  {
                    title: "Analyse og generering av lysløp",
                    label: "Steg 2",
                    body: "AI bygger cues, overganger og dynamikk som følger musikken – ikke tilfeldige effekter.",
                  },
                  {
                    title: "Kjør show med trygg live-justering",
                    label: "Steg 3",
                    body: "Kjør fra kontrolleren og juster i iPad/desktop. Guardrails sikrer at uttrykket holder seg stabilt.",
                  },
                ].map((item, index) => (
                  <li key={item.title} className="relative space-y-2 pl-2">
                    <span className="absolute left-[-0.65rem] top-2 h-3 w-3 rounded-full bg-neutral-900 ring-4 ring-white" />
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-900">{index + 1}</span>
                      <span>{item.label}</span>
                    </div>
                    <h3 className="text-base font-semibold text-neutral-950 clamp-2">{item.title}</h3>
                    <p className="content-max text-sm leading-6 text-neutral-800 clamp-3">{item.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="section-block">
          <div className="space-y-6">
            <div className="flex items-baseline justify-between gap-3">
              <div className="space-y-1">
                <p className="label-text text-sm font-semibold text-neutral-900">Bevis</p>
                <h2 className="heading-max text-2xl font-semibold leading-tight text-neutral-950 clamp-2">
                  Hva vi optimaliserer for
                </h2>
              </div>
              <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Pilot
              </span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-3 rounded-3xl bg-white p-6 shadow-[0_16px_50px_-36px_rgba(0,0,0,0.4)] ring-1 ring-neutral-200">
                <p className="text-sm font-semibold text-neutral-900">Målt i pilot</p>
                <ul className="space-y-2 text-sm leading-6 text-neutral-800">
                  <li>Lav latency og stabil timing.</li>
                  <li>Forutsigbarhet: samme input gir samme output.</li>
                  <li>Robusthet i ekte oppsett (ikke lab-demoer).</li>
                  <li>Dokumentert timing/latency og stabilitet for ulike venues.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 ring-1 ring-neutral-200">
                  <p className="text-sm font-semibold text-neutral-900">Stabilitet</p>
                  <span className="text-sm font-semibold text-neutral-700">Guardrails på alt live</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-neutral-200">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-700">Tempo</p>
                    <p className="text-sm font-semibold text-neutral-900">Presis BPM-sporing med frasering</p>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 px-4 py-3 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Output</p>
                    <p className="text-sm font-semibold text-white">Repeterbar mapping – ikke tilfeldige effekter</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-neutral-200 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-700">Oppetid</p>
                    <p className="text-sm font-semibold text-neutral-900">Designet for klubber, små scener og mobile rigs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-block">
          <div className="grid gap-6 rounded-3xl bg-neutral-900 p-6 text-white shadow-[0_16px_50px_-36px_rgba(0,0,0,0.5)] ring-1 ring-neutral-800 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div className="space-y-2">
              <h2 className="heading-max text-xl font-semibold text-white clamp-2">Vil du være tidlig ute?</h2>
              <p className="content-max text-sm text-white/80 clamp-3">
                Meld interesse for pilot. Vi kontakter et begrenset antall først.
              </p>
            </div>
            <InterestSignup
              variant="cta"
              title="Meld interesse – vi tar kontakt"
              description="Bli med i pilotkøen – vi følger opp."
              contextSource="home-cta"
            />
          </div>
        </div>

        <div className="section-block">
          <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-start">
            <div className="space-y-3">
              <p className="label-text text-sm font-semibold text-neutral-900">Hvem det er for</p>
              <h2 className="heading-max text-xl font-semibold text-neutral-950 clamp-2">
                Operatører som vil ha driftssikker automasjon
              </h2>
              <div className="space-y-2 text-base leading-7 text-neutral-800">
                <p>Klubb/utested – små scener – utleie/event – russebuss/mobile rigs.</p>
                <p>For team som må levere jevne show med liten bemanning og tydelige guardrails.</p>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl bg-white p-5 shadow-[0_16px_50px_-36px_rgba(0,0,0,0.4)] ring-1 ring-neutral-200">
              <p className="text-sm font-semibold text-neutral-900">
                Vil du se mer detaljert?{" "}
                <Link href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-700">
                  Les hvordan systemet fungerer
                </Link>
              </p>
              <div className="flex flex-col gap-2 text-sm font-semibold text-neutral-900">
                <Link href="/use-cases" className="underline underline-offset-4 hover:text-neutral-700">
                  Bruksscenarier
                </Link>
                <Link href="/guides" className="underline underline-offset-4 hover:text-neutral-700">
                  Guider
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section-block">
          <div className="space-y-4">
            <h2 className="heading-max text-xl font-semibold text-neutral-950 clamp-2">Utforsk mer</h2>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-neutral-900">
              <Link href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-700">
                Hvordan AI DMX-kontrolleren fungerer
              </Link>
              <Link href="/ai-dmx-controller/alternatives" className="underline underline-offset-4 hover:text-neutral-700">
                AI DMX-alternativer
              </Link>
              <Link href="/ai-dmx-controller/vs-maestrodmx" className="underline underline-offset-4 hover:text-neutral-700">
                Y-Link vs MaestroDMX
              </Link>
              <Link href="/use-cases" className="underline underline-offset-4 hover:text-neutral-700">
                Bruksscenarier
              </Link>
              <Link href="/guides" className="underline underline-offset-4 hover:text-neutral-700">
                Guider
              </Link>
              <Link href="/faq" className="underline underline-offset-4 hover:text-neutral-700">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
