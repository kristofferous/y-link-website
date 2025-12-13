import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { StructuredData } from "@/components/StructuredData"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Teknisk oversikt",
  description: "Hvordan Y-Link analyserer lyd, genererer cues, håndterer latency-budsjett og leverer sikkert DMX.",
  alternates: {
    canonical: "/teknisk",
  },
}

const techSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Y-Link teknisk oversikt",
  about: "Lydanalyse, deterministisk DMX-avspilling og latency-budsjett",
  url: absoluteUrl("/teknisk"),
  inLanguage: "nb",
  author: {
    "@type": "Organization",
    name: "Y-Link",
    url: absoluteUrl("/"),
  },
  keywords: ["AI DMX-kontroller", "musikkreaktivt lys", "DMX latency", "DMX stabilitet"],
}

export default function TechnicalPage() {
  return (
    <main>
      <StructuredData data={techSchema} />
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "Technical" }]} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Technical</p>
            <h1 className="text-heading-lg text-foreground">
              AI-Based DMX with Low Latency, Predictable Playback, and Safety
            </h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Y-Link analyzes audio, generates cues, and delivers DMX within strict time requirements. Runtime is tuned
              for stable latency and clear overrides, keeping the show synchronized.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-6 text-foreground">Pipeline</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Audio analysis for tempo, phrases, energy, and changes.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Planner builds cues, transitions, and guardrails per rig.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Output validated against latency budget and safety limits.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-6 text-foreground">Safety and Control</h2>
              <p className="text-body mb-4 text-muted-foreground">
                Operators have locks for intensity, blackout rules, and ability to override. Guardrails prevent random
                jumps even when adjusting live.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/guides/dmx-latency-jitter"
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  Latency and jitter guide
                </Link>
                <Link
                  href="/pilot"
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  Join the pilot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
