import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InterestCtaButton } from "@/components/InterestCtaButton";
import { InterestSignup } from "@/components/InterestSignup";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Om Y-Link",
  description:
    "AI-drevet DMX-kontroller for musikkdrevne venues. Se hvorfor, hvem det passer for, og hvordan det fungerer.",
  alternates: {
    canonical: "/om",
  },
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <header className="section-block space-y-4">
          <Breadcrumbs
            className="mt-2"
            items={[
              { label: "Hjem", href: "/" },
              { label: "Om" },
            ]}
          />
          <p className="label-text text-sm text-neutral-800">Om Y-Link</p>
          <h1 className="heading-max text-3xl font-bold text-neutral-950 clamp-2">
            AI-drevet DMX-kontroller for musikkdrevne venues
          </h1>
          <p className="content-max text-base leading-7 text-neutral-800 clamp-3">
            Y-Link genererer lysløp automatisk fra musikk – med presis timing, guardrails og operatørkontroll. Laget for
            klubber, små scener og mobile oppsett som trenger forutsigbare show.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <InterestCtaButton
              context="about-hero"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
            >
              Meld interesse
            </InterestCtaButton>
            <a
              href="#hvordan"
              className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
            >
              Hvordan det fungerer
            </a>
          </div>
          <ul className="flex flex-wrap gap-2 text-sm text-neutral-800">
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
        </header>

        <div className="section-block space-y-6 rounded-3xl bg-white p-6 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200">
          <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Hvorfor Y-Link</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Mindre bemanning, høyere tempo.</li>
            <li>Show som sitter hver gang – ikke tilfeldige effekter.</li>
            <li>Raskt oppsett for små venues og mobile rigs.</li>
          </ul>
          <p className="content-max text-sm text-neutral-800 clamp-2">
            Målet er å gjøre solide lysløp til standard, ikke et sideprosjekt.
          </p>
        </div>

        <div className="section-block space-y-6 rounded-3xl bg-neutral-50 p-6 ring-1 ring-neutral-200" id="hvordan">
          <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Hvordan det fungerer</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Audio inn",
                body: "Importer spillelister eller bruk live lyd. Systemet henter tempo, fraser og energi.",
              },
              {
                title: "Planlagte lysløp",
                body: "AI bygger cues, overganger og guardrails som følger musikken og riggen din.",
              },
              {
                title: "Live med kontroll",
                body: "Operatør kan overstyre, mens systemet holder struktur og timing stabil.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 text-sm text-neutral-900 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]"
              >
                <p className="font-semibold clamp-2">{item.title}</p>
                <p className="text-sm leading-6 text-neutral-800 clamp-3">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white/70 p-4 text-sm text-neutral-800 ring-1 ring-dashed ring-neutral-200">
            Ingen manuell programmering og ingen tilfeldige effekter – guardrails holder timing og intensitet på plass.
          </div>
        </div>

        <div className="section-block space-y-6 rounded-3xl bg-white p-6 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200">
          <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Hvem det er for</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Klubb/utested",
              "Små scener",
              "Utleie/event",
              "Russebuss/mobile rigs",
              "Operatører som vil spare tid",
            ].map((item) => (
              <div
                key={item}
                className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 text-sm text-neutral-900 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]"
              >
                <p className="font-semibold clamp-2">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-neutral-800">
            Se detaljer i{" "}
            <Link href="/use-cases" className="underline underline-offset-4 hover:text-neutral-700">
              bruksscenarier
            </Link>{" "}
            eller les{" "}
            <Link href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-700">
              hvordan systemet fungerer
            </Link>
            .
          </p>
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
              contextSource="about-cta"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
