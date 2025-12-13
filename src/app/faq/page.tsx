import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { StructuredData } from "@/components/StructuredData"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Vanlige spørsmål om Y-Link, AI DMX-kontrolleren, pilotprogrammet og e-postpreferanser.",
  alternates: {
    canonical: "/faq",
  },
}

const items = [
  {
    q: "What does the AI automate?",
    a: "The controller analyzes audio for tempo, phrases, and energy. It builds cues, transitions, and guardrails that follow the track without manual programming.",
  },
  {
    q: "Can operators still control the rig?",
    a: "Yes. Operators can approve looks, lock intensity, rehearse sections, and override automation. The goal is predictable playback with human control.",
  },
  {
    q: "How is latency handled?",
    a: "Each step is budgeted, and playback is validated before output. Runtime is tuned for low jitter in clubs and small venues.",
  },
  {
    q: "Which fixtures and universes are supported?",
    a: "We target common DMX universes with profiles for clubs and small venues. Universe planning and saturation checks run before playback.",
  },
  {
    q: "How do I join the pilot or pre-order?",
    a: "Use the form on the homepage or pilot page. The pilot is time-limited (approx. 4-8 weeks), with Y1 hardware loaned and returned afterward. We take in a small, curated group to test stability, timing, and UX.",
  },
  {
    q: "How do I unsubscribe from emails?",
    a: "Each email has an unsubscribe link. You can also visit /unsubscribe?token=<your-token> to remove your address immediately.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
  url: absoluteUrl("/faq"),
}

export default function FAQPage() {
  return (
    <main>
      <StructuredData data={faqSchema} />
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "FAQ" }]} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Support</p>
            <h1 className="text-heading-lg text-foreground">Frequently Asked Questions</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Get clarity on what's automated, how operators maintain control, and how to sign up or unsubscribe.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.q} className="rounded-lg border border-border/40 bg-card p-6">
                <h2 className="text-title mb-3 text-foreground">{item.q}</h2>
                <p className="text-body text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
