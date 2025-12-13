import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { PageShell } from "@/components/PageShell"
import { SectionCard } from "@/components/SectionCard"

export const metadata: Metadata = {
  title: "Personvern",
  description: "Hvordan Y-Link håndterer kontaktdata for piloter, forhåndsinteresse og oppdateringer.",
  alternates: {
    canonical: "/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <PageShell className="max-w-4xl">
      <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "Personvern" }]} />
      <SectionCard>
        <header className="space-y-3">
          <p className="text-label text-muted-foreground">Personvern</p>
          <h1 className="text-heading text-foreground">Slik håndterer vi data</h1>
        </header>

        <div className="mt-8 space-y-6 text-body text-muted-foreground">
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
            <a href="mailto:hello@y-link.no" className="text-foreground underline underline-offset-4 hover:opacity-80">
              hello@y-link.no
            </a>{" "}
            så fjerner vi oppføringen.
          </p>
        </div>
      </SectionCard>
    </PageShell>
    // </CHANGE>
  )
}
