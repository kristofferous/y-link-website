import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { InterestCtaButton } from "@/components/InterestCtaButton"

export const metadata: Metadata = {
  title: "Pilotprogram",
  description:
    "Profesjonell pilot for Y-Link: validere stabilitet, timing og brukervennlighet i ekte venues med tidsbegrenset lån av Y1-hardware.",
  alternates: {
    canonical: "/pilot",
  },
}

export default function PilotPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "Pilot" }]} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-accent px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-label text-muted-foreground">Limited Slots</span>
            </div>
            <h1 className="text-display text-foreground">
              Pilot Program
              <br />
              <span className="text-muted-foreground">Controlled Rollout in Real Venues</span>
            </h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              The purpose is to validate stability, timing, and usability in real shows, with structured technical and
              operational feedback. This is a controlled pilot, not an open beta giveaway.
            </p>
            <InterestCtaButton
              context="pilot-hero"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Apply for Pilot Access
            </InterestCtaButton>
          </div>
        </div>
      </section>

      {/* What It Is / What It Isn't */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-6 text-foreground">What the Pilot Is</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Validate stability, timing, and operation in real venue environments.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Collect structured technical and operational feedback.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Controlled pilot with few partners - not an open beta.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Time-limited period: approximately 4-8 weeks.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Y1 hardware loaned out, Y-Link property, returned after pilot.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-accent p-8">
              <h2 className="text-heading mb-6 text-foreground">What It Is Not</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  Not a finished commercial product.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  Not a free hardware giveaway.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  Not full production coverage - focus is on pilot verification.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Partners Get / What We Expect */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-heading text-foreground">What Pilot Partners Get</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Temporary loan of Y1 hardware (pilot/pre-production unit)",
                  "Full access to Y-Link Studio during pilot period",
                  "Music-reactive AI lighting with deterministic playback",
                  "Setup assistance and direct dialogue with the team",
                  "Ongoing software updates throughout the pilot",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                      <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-heading text-foreground">What We Expect</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Use in real shows or events",
                  "Feedback on stability, timing, and show quality",
                  "Willingness for short feedback sessions",
                  "Optional: consent for anonymous pilot case study",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                      <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-xl border border-border/40 bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-heading text-foreground">Ready to Become a Pilot Partner?</h2>
              <p className="text-body text-muted-foreground">
                One point of contact, quick feedback, and updates throughout the pilot period.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <InterestCtaButton
                  context="pilot-footer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Apply Now
                </InterestCtaButton>
                <Link
                  href="/ai-dmx-controller"
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  See how the system works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
