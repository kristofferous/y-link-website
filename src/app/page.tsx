import Link from "next/link"
import { InterestCtaButton } from "@/components/InterestCtaButton"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-accent px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-label text-muted-foreground">Pilot Program Open</span>
            </div>

            <h1 className="text-display text-foreground">
              Professional DMX Control.
              <br />
              <span className="text-muted-foreground">Built for Live Performance.</span>
            </h1>

            <p className="text-body-lg text-muted-foreground prose-constrained mx-auto">
              Y-Link transforms audio into precise lighting sequences with stable timing and live control. Engineered
              for clubs, small venues, and mobile setups where reliability matters.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <InterestCtaButton
                context="hero"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Join Pilot Program
              </InterestCtaButton>
              <Link
                href="/ai-dmx-controller"
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-accent">
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-title text-foreground">Automated Sequences</h3>
              <p className="text-body text-muted-foreground">
                Generate lighting cues from audio analysis. No manual programming required.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-accent">
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-title text-foreground">Precise Timing</h3>
              <p className="text-body text-muted-foreground">
                BPM-locked execution with phrase detection. Consistent performance across sessions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-accent">
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-title text-foreground">Live Guardrails</h3>
              <p className="text-body text-muted-foreground">
                Override controls that maintain timing and structure. Safe adjustments during live shows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 space-y-4 text-center">
              <p className="text-label text-muted-foreground">System Architecture</p>
              <h2 className="text-heading-lg text-foreground">From Audio to Light</h2>
              <p className="text-body text-muted-foreground prose-constrained mx-auto">
                Three-stage pipeline designed for reliability and predictability.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Audio Analysis",
                  description:
                    "Extract tempo, phrase structure, and energy profile from live or imported audio sources.",
                },
                {
                  step: "02",
                  title: "Sequence Generation",
                  description: "Generate cues, transitions, and intensity curves mapped to musical structure.",
                },
                {
                  step: "03",
                  title: "Live Execution",
                  description: "Run sequences with real-time adjustments. Guardrails preserve timing and coherence.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 rounded-lg border border-border/40 bg-card p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border/40 bg-background font-mono text-sm font-semibold text-foreground">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-title text-foreground">{item.title}</h3>
                    <p className="text-body text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-label text-muted-foreground">Engineering Focus</p>
                <h2 className="text-heading text-foreground">Built for Stability</h2>
                <p className="text-body text-muted-foreground">
                  Measured in pilot deployments across multiple venue types. Optimized for low latency, repeatable
                  output, and operational uptime.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Low-latency DMX output with jitter mitigation",
                  "Deterministic sequence generation",
                  "Robust error handling and recovery",
                  "Real-time performance monitoring",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border/40 bg-accent">
                      <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-body text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border/40 bg-card p-6">
                <div className="mb-4 text-label text-muted-foreground">Performance Metrics</div>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-body text-muted-foreground">Timing Accuracy</span>
                      <span className="font-mono text-sm font-semibold text-foreground">±2ms</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-accent">
                      <div className="h-full w-[98%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-body text-muted-foreground">Sequence Stability</span>
                      <span className="font-mono text-sm font-semibold text-foreground">99.7%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-accent">
                      <div className="h-full w-[99.7%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-body text-muted-foreground">Uptime (Pilot)</span>
                      <span className="font-mono text-sm font-semibold text-foreground">99.2%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-accent">
                      <div className="h-full w-[99.2%] rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Measured across 6 pilot venues over 3 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Preview */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mb-12 space-y-4">
            <p className="text-label text-muted-foreground">Applications</p>
            <h2 className="text-heading-lg text-foreground">Built for Professional Use</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Clubs & Venues", description: "Consistent shows with minimal staffing requirements" },
              { title: "Mobile Setups", description: "Quick deployment for touring and event productions" },
              { title: "Small Venues", description: "Professional automation without dedicated lighting operator" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:bg-accent"
              >
                <h3 className="text-title mb-2 text-foreground">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/use-cases"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80"
            >
              View detailed use cases
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl rounded-xl border border-border/40 bg-card p-8 text-center md:p-12">
            <div className="space-y-6">
              <h2 className="text-heading text-foreground">Join the Pilot Program</h2>
              <p className="text-body text-muted-foreground prose-constrained mx-auto">
                Limited slots available for early access. We're working with select venues to refine the platform.
              </p>
              <InterestCtaButton
                context="cta"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Apply for Pilot Access
              </InterestCtaButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
