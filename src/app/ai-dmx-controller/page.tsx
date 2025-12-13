import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "AI DMX-kontroller",
  description:
    "Y-Link er en AI-drevet DMX-kontroller som gjør lyd om til forutsigbare, musikkstyrte lysløp med lav latency.",
  alternates: {
    canonical: "/ai-dmx-controller",
  },
}

export default function AIDMXControllerPage() {
  return (
    <main>
      {/* Header Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "AI DMX-kontroller" }]} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Platform</p>
            <h1 className="text-display text-foreground">
              AI DMX Controller
              <br />
              <span className="text-muted-foreground">for Music-Reactive Lighting</span>
            </h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Y-Link converts audio to lighting sequences that follow tempo, phrasing, and energy. Low latency,
              guardrails, and operator control ensure your show is predictable, not random.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
                AI DMX Controller
              </span>
              <span className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground">
                Music Reactive
              </span>
              <span className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground">
                Low Latency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mb-12 flex items-center gap-4">
            <h2 className="text-heading text-foreground">How It Works</h2>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Audio Input",
                body: "Upload music or use live audio. The system captures tempo, phrases, and energy.",
              },
              {
                step: "02",
                title: "Planning",
                body: "AI plans cues, transitions, and safety limits tailored to your rig.",
              },
              {
                step: "03",
                title: "Deterministic Playback",
                body: "Signals are timed and monitored before output. Latency budget enforced live.",
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
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-heading text-foreground">Who It's For</h2>
              <ul className="space-y-4 text-body text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Clubs and bars wanting music-reactive lighting without manual programming.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Small stages and installations with minimal staffing but timing requirements.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Mobile rigs needing fast load-ins and predictable playback.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Operators wanting guardrails and the ability to override at any time.
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                See also{" "}
                <Link
                  href="/use-cases/music-reactive-dmx-clubs"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  club use case
                </Link>{" "}
                or{" "}
                <Link
                  href="/use-cases/automated-dmx-small-venues"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  small venue automation
                </Link>
                .
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-6">
              <h3 className="text-title mb-4 text-foreground">Setup Requirements</h3>
              <ul className="space-y-3 text-body text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                    <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Audio upload or live feed
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                    <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Fixture list and universes for planning and safety
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                    <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Network for updates and remote monitoring
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                    <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Operator interface (desktop or iPad)
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Timing and saturation validated before show so rehearsal matches live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-xl border border-border/40 bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-heading text-foreground">Next Steps</h2>
              <p className="text-body text-muted-foreground">
                Need music-reactive lighting with predictable timing? Join the pilot, and we'll document latency in your
                rig and fine-tune guardrails.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/pilot"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Apply for Pilot
                </Link>
                <Link
                  href="/guides/dmx-latency-jitter"
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  Read about latency and jitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
