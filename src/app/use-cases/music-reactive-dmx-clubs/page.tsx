import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Musikkreaktivt DMX-lys for klubber",
  description: "Hold klubblyset synkronisert med hvert spor med Y-Link AI DMX-kontrolleren.",
  alternates: {
    canonical: "/use-cases/music-reactive-dmx-clubs",
  },
}

export default function MusicReactiveClubsPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Hjem", href: "/" },
              { label: "Use Cases", href: "/use-cases" },
              { label: "Music-Reactive Clubs" },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Use Case</p>
            <h1 className="text-heading-lg text-foreground">Music-Reactive DMX Lighting for Clubs</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Deliver a tight, music-driven show without programming each track by hand. Y-Link analyzes audio and
              controls DMX with low latency, so the operator can follow the room instead of the console.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Audio-Driven Cues",
                body: "Upload playlists or use a live mix. The controller follows tempo, phrasing, and energy.",
              },
              {
                title: "Predictable Timing",
                body: "Latency budget is monitored. No surprises when the room fills and load changes.",
              },
              {
                title: "Guardrails for Operators",
                body: "Intensity limits, blackout rules, and approvals keep the rig safe.",
              },
              {
                title: "Quick Switches",
                body: "Repertoire can be rehearsed, cues locked, and playlists swapped quickly between DJs.",
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
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-6 text-foreground">How to Set Up in a Club</h2>
              <ol className="space-y-4 text-body text-muted-foreground">
                {[
                  "Share fixture list, universe setup, and room constraints.",
                  "Upload a starter playlist or connect live audio.",
                  "Run preflight for timing, saturation, and safety limits.",
                  "Rehearse sections, lock important looks, and set operator override.",
                  "Go live with monitoring; adjust intensity or looks as needed.",
                ].map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 bg-accent text-sm font-semibold text-foreground">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="rounded-xl border border-border/40 bg-card p-8 md:p-12">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-heading text-foreground">Next Steps</h2>
              <p className="text-body text-muted-foreground">
                If you need music-reactive lighting with predictable timing, join the pilot. We validate timing in your
                room and adjust guardrails to your rig.
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
                  Read the latency and jitter guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
