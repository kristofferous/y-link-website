import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Personvern",
  description: "Hvordan Y-Link håndterer kontaktdata for piloter, forhåndsinteresse og oppdateringer.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative">
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Hjem", href: "/" },
              { label: "Personvern" },
            ]}
          />
        </div>
        <SectionCard>
          <header className="space-y-3">
            <p className="label-text text-sm text-neutral-800">Personvern</p>
            <h1 className="text-3xl font-bold text-neutral-950">Slik håndterer vi data</h1>
          </header>

          <div className="mt-8 space-y-6 text-base leading-7 text-neutral-800">
            <p>
              Vi samler navn (valgfritt), e-post og valgt interesse slik at vi kan sende Y-Link-oppdateringer, koordinere
              pilottilgang eller følge opp forhåndsinteresse.
            </p>
            <p>
              Data lagres sikkert i Supabase. E-poster inneholder en avmeldingslenke som stopper videre kommunikasjon
              umiddelbart. Vi selger eller deler ikke kontaktinformasjon med tredjeparter.
            </p>
            <p>
              For å slette data, send en e-post til{" "}
              <a href="mailto:hello@y-link.no" className="underline underline-offset-4">
                hello@y-link.no
              </a>{" "}
              så fjerner vi oppføringen.
            </p>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
