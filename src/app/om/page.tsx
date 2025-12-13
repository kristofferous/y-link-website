import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { InterestCtaButton } from "@/components/InterestCtaButton"

export const metadata: Metadata = {
  title: "Om Y-Link",
  description:
    "AI-drevet DMX-kontroller for musikkdrevne venues. Se hvorfor, hvem det passer for, og hvordan det fungerer.",
  alternates: {
    canonical: "/om",
  },
}

export default function AboutPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "About" }]} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">About</p>
            <h1 className="text-display text-foreground">
              AI-Powered DMX Controller
              <br />
              <span className="text-muted-foreground">for Music-Driven Venues</span>
            </h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Y-Link generates lighting sequences automatically from music - with precise timing, guardrails, and
              operator control. Made for clubs, small stages, and mobile setups that need predictable shows.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <InterestCtaButton
                context="about-hero"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Express Interest
              </InterestCtaButton>
              <a
                href="#how"
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Y-Link */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-lg border border-border/40 bg-card p-8 md:p-12">
            <h2 className="text-heading mb-6 text-foreground">Why Y-Link</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                "Less staffing, higher tempo.",
                "Shows that land every time - not random effects.",
                "Fast setup for small venues and mobile rigs.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <p className="text-body text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              The goal is to make solid lighting sequences the standard, not a side project.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing border-t border-border/40" id="how">
        <div className="container-custom">
          <h2 className="text-heading mb-8 text-foreground">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Audio In",
                body: "Import playlists or use live audio. The system extracts tempo, phrases, and energy.",
              },
              {
                step: "02",
                title: "Planned Sequences",
                body: "AI builds cues, transitions, and guardrails that follow the music and your rig.",
              },
              {
                step: "03",
                title: "Live with Control",
                body: "Operator can override while the system maintains structure and timing stability.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border/40 bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-background font-mono text-sm font-semibold text-foreground">
                  {item.step}
                </div>
                <h3 className="text-title mb-2 text-foreground">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <h2 className="text-heading mb-8 text-foreground">Who It's For</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Club/Venue", "Small Stages", "Rental/Event", "Mobile Rigs", "Operators Saving Time"].map((item) => (
              <div key={item} className="rounded-lg border border-border/40 bg-card px-5 py-4">
                <p className="text-body font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            See details in{" "}
            <Link href="/use-cases" className="text-foreground underline underline-offset-4 hover:opacity-80">
              use cases
            </Link>{" "}
            or read{" "}
            <Link href="/ai-dmx-controller" className="text-foreground underline underline-offset-4 hover:opacity-80">
              how the system works
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-xl border border-border/40 bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-heading text-foreground">Want to Be Early?</h2>
              <p className="text-body text-muted-foreground">
                Express interest for the pilot. We contact a limited number first.
              </p>
              <InterestCtaButton
                context="about-cta"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Express Interest
              </InterestCtaButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
