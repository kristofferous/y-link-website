import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Y-Link vs MaestroDMX",
  description: "Brief comparison of Y-Link and MaestroDMX for music-reactive lighting.",
  alternates: {
    canonical: "/ai-dmx-controller/vs-maestrodmx",
  },
}

const comparison = [
  {
    label: "Focus",
    ylink: "AI-planned light sequences with guardrails and low latency.",
    maestro: "Audio analysis and automation for DJ sets.",
  },
  {
    label: "Operator Control",
    ylink: "Approvals, locks, and override without losing structure.",
    maestro: "DJ-oriented workflow with more manual control.",
  },
  {
    label: "Best For",
    ylink: "Clubs/small venues with minimal staffing needing predictability.",
    maestro: "DJ-focused rooms wanting to trigger lights directly from music.",
  },
]

export default function VsMaestroPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "AI DMX Controller", href: "/ai-dmx-controller" },
              { label: "Y-Link vs MaestroDMX" },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Comparison</p>
            <h1 className="text-heading-lg text-foreground">Y-Link vs MaestroDMX</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Two different approaches to music-reactive lighting. Here's how they differ.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-label font-semibold text-muted-foreground">Criterion</div>
                <div className="text-label font-semibold text-muted-foreground">Y-Link</div>
                <div className="text-label font-semibold text-muted-foreground">MaestroDMX</div>
                {comparison.map((row, index) => (
                  <>
                    <div
                      key={`${row.label}-label-${index}`}
                      className="rounded-lg bg-accent p-4 text-sm font-semibold text-foreground"
                    >
                      {row.label}
                    </div>
                    <div
                      key={`${row.label}-ylink-${index}`}
                      className="rounded-lg border border-border/40 bg-background p-4 text-sm text-muted-foreground"
                    >
                      {row.ylink}
                    </div>
                    <div
                      key={`${row.label}-maestro-${index}`}
                      className="rounded-lg border border-border/40 bg-background p-4 text-sm text-muted-foreground"
                    >
                      {row.maestro}
                    </div>
                  </>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                For details on Y-Link, see the main page for the{" "}
                <a href="/ai-dmx-controller" className="text-foreground underline underline-offset-4 hover:opacity-80">
                  AI DMX Controller
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
