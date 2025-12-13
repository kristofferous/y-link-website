import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Beat-Synced Lighting Without Programming",
  description: "Upload tracks, validate timing, and run shows quickly with Y-Link and guardrails.",
  alternates: {
    canonical: "/use-cases/beat-synced-lighting-without-programming",
  },
}

export default function BeatSyncedLightingPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Use Cases", href: "/use-cases" },
              { label: "Beat-Synced Lighting" },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Use Case</p>
            <h1 className="text-heading-lg text-foreground">Beat-Synced Lighting Without Programming</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Y-Link analyzes tempo, phrases, and energy in your tracks, generates light sequences, and locks timing
              before output. Skip manual programming but still override live.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Upload or Live Feed",
                body: "Import playlists or connect live audio. The system extracts structure automatically.",
              },
              {
                title: "Preflight Before Show",
                body: "Timing, jitter, and saturation are checked before output. Guardrails are set per rig.",
              },
              {
                title: "Live Adjustment",
                body: "Change intensity and looks without losing locked timing.",
              },
              {
                title: "Quick Execution",
                body: "Ready for show without building cue-by-cue, but still with control surfaces for operator.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border/40 bg-card p-6">
                <h2 className="text-title mb-3 text-foreground">{item.title}</h2>
                <p className="text-body text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl rounded-lg border border-border/40 bg-card p-8">
            <h2 className="text-heading mb-6 text-foreground">Start Quickly</h2>
            <ol className="space-y-4 text-body text-muted-foreground">
              {[
                "Share rig data and universes.",
                "Upload tracks or connect audio source.",
                "Run preflight and lock timing.",
                "Mark where operator can override.",
                "Go live with monitoring.",
              ].map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 bg-accent text-sm font-semibold text-foreground">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              More info? Read{" "}
              <Link href="/ai-dmx-controller" className="text-foreground underline underline-offset-4 hover:opacity-80">
                how the system works
              </Link>{" "}
              or{" "}
              <Link href="/pilot" className="text-foreground underline underline-offset-4 hover:opacity-80">
                apply for pilot
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
