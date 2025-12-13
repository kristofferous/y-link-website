import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Latency and Jitter in DMX",
  description: "How to measure and control latency and jitter in an AI-controlled DMX rig.",
  alternates: {
    canonical: "/guides/dmx-latency-jitter",
  },
}

export default function DMXLatencyJitterPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: "Latency and Jitter" },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Guide</p>
            <h1 className="text-heading-lg text-foreground">Latency and Jitter in DMX</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Timing is the core value in music-reactive lighting. Here's how we measure, budget, and monitor latency
              and jitter.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Measurement</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Measure end-to-end latency with known test audio and sensor on light.",
                  "Look for jitter (variation) between cues and output.",
                  "Log under full load, not just in an empty room.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Control</h2>
              <p className="text-body text-muted-foreground">
                Y-Link budgets each step and monitors drift. If deviations are detected, output is tightened or the
                operator is notified. Keep network and nodes stable for best results.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Related reading:{" "}
                <Link
                  href="/guides/dmx-best-practices"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  best practices
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
