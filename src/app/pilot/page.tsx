import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InterestCtaButton } from "@/components/InterestCtaButton";
import { InterestSignup } from "@/components/InterestSignup";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Pilotprogram",
  description:
    "Profesjonell pilot for Y-Link: validere stabilitet, timing og brukervennlighet i ekte venues med tidsbegrenset lån av Y1-hardware.",
  alternates: {
    canonical: "/pilot",
  },
};

export default function PilotPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <header className="section-block space-y-4">
          <Breadcrumbs
            items={[
              { label: "Hjem", href: "/" },
              { label: "Pilot" },
            ]}
          />
          <p className="label-text text-sm text-neutral-800">Pilot</p>
          <h1 className="heading-max text-3xl font-bold text-neutral-950 clamp-2">
            Pilot: kontrollert utrulling i ekte venues
          </h1>
          <p className="content-max text-base leading-7 text-neutral-800 clamp-3">
            Formålet er å validere stabilitet, timing og brukervennlighet i reelle show, med strukturert teknisk og
            operasjonell tilbakemelding. Dette er en kontrollert pilot, ikke et åpent beta-giveaway.
          </p>
        </header>

        <div className="section-block">
          <InterestSignup
            variant="hero"
            title="Meld interesse – vi tar kontakt"
            description="Pilotinvitasjon og oppdateringer. Legg igjen e-post, så følger vi opp."
            contextSource="pilot-hero"
          />
        </div>

        <div className="section-block grid gap-6 rounded-3xl bg-white p-6 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200 md:grid-cols-2">
          <div className="space-y-3">
            <p className="label-text text-xs font-semibold text-neutral-700 uppercase">Hva piloten er</p>
            <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Formål</h2>
            <ul className="space-y-2 text-base leading-7 text-neutral-800">
              <li>Validere stabilitet, timing og drift i ekte venue-miljøer.</li>
              <li>Samle strukturert teknisk og operasjonell feedback.</li>
              <li>Kontrollert pilot med få partnere – ikke en åpen beta.</li>
            </ul>
            <h3 className="text-sm font-semibold text-neutral-900">Struktur og rammer</h3>
            <ul className="space-y-2 text-sm leading-6 text-neutral-800">
              <li>Tidsbegrenset periode: ca. 4–8 uker.</li>
              <li>Begrenset antall partnere (kurert gruppe).</li>
              <li>Y1-hardware lånes ut, er Y-Link eiendom og returneres etter pilot.</li>
              <li>Ikke dekket av full produksjons-SLA.</li>
            </ul>
          </div>
          <div className="space-y-3 rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
            <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Dette er ikke</h2>
            <ul className="space-y-2 text-base leading-7 text-neutral-800">
              <li>Ikke et ferdig kommersielt produkt.</li>
              <li>Ikke en gratis hardware-giveaway.</li>
              <li>Ikke full produksjonsdekning – fokus er på pilotverifisering.</li>
            </ul>
          </div>
        </div>

        <div className="section-block grid gap-6 rounded-3xl bg-white p-6 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Hva pilotpartnere får</h2>
            <ul className="space-y-2 text-base leading-7 text-neutral-800">
              <li>Midlertidig lån av Y1-hardware (pilot-/pre-produksjonsenhet).</li>
              <li>Full tilgang til Y-Link Studio i pilotperioden.</li>
              <li>Musikkreaktiv AI-belysning med deterministisk avspilling.</li>
              <li>Oppsettshjelp og direkte dialog med teamet.</li>
              <li>Løpende programvareoppdateringer gjennom piloten.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Hva vi forventer</h2>
            <ul className="space-y-2 text-base leading-7 text-neutral-800">
              <li>Bruk i ekte show eller arrangementer.</li>
              <li>Tilbakemelding på stabilitet, timing og showkvalitet.</li>
              <li>Vilje til korte tilbakemeldingsøkter.</li>
              <li>Valgfritt: samtykke til anonymt pilotcase.</li>
            </ul>
          </div>
        </div>

        <div className="section-block space-y-4 rounded-3xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
          <h2 className="heading-max text-xl font-semibold text-neutral-900 clamp-2">Oppsummert omfang</h2>
          <p className="text-base leading-7 text-neutral-800">
            Piloten er tidsavgrenset, kurert og fokusert på måling av stabilitet og timing. Hardware lånes ut og
            returneres. Partnerne får tett oppfølging, men dette er ikke et ferdig produkt eller gratis utstyr.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-neutral-900">
            <Link href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-700">
              Se hvordan systemet fungerer
            </Link>
            <Link href="/use-cases" className="underline underline-offset-4 hover:text-neutral-700">
              Bruksscenarier
            </Link>
          </div>
        </div>

        <div className="section-block">
          <div className="flex flex-col gap-3 rounded-3xl bg-neutral-900 p-6 text-white shadow-[0_16px_50px_-36px_rgba(0,0,0,0.5)] ring-1 ring-neutral-800">
            <h2 className="heading-max text-xl font-semibold text-white clamp-2">Klar til å bli pilotpartner?</h2>
            <p className="text-sm text-white/80">
              Én kontaktflate, raske tilbakemeldinger og oppdateringer gjennom pilotperioden.
            </p>
            <InterestCtaButton
              context="pilot-footer"
              className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            >
              Meld interesse
            </InterestCtaButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
