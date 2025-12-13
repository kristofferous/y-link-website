import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Bruksscenarier",
  description:
    "Se hvordan Y-Link passer for klubber, små scener og team som vil automatisere lys uten å miste kontroll.",
  alternates: {
    canonical: "/use-cases",
  },
}

const useCases = [
  {
    title: "Music-Reactive DMX for Clubs",
    href: "/use-cases/music-reactive-dmx-clubs",
    detail: "Keep the dance floor synchronized with the audio source with predictable timing.",
  },
  {
    title: "Automated DMX for Small Venues",
    href: "/use-cases/automated-dmx-small-venues",
    detail: "Less manual programming, same expression night after night.",
  },
  {
    title: "Beat-Synced Lighting Without Programming",
    href: "/use-cases/beat-synced-lighting-without-programming",
    detail: "Upload tracks, verify timing, and go live quickly with guardrails.",
  },
]

export default function UseCasesPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "Use Cases" }]} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Applications</p>
            <h1 className="text-heading-lg text-foreground">Where Y-Link Fits Best</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Music-reactive automation, low latency, and operator override make Y-Link suitable where staffing is lean
              and timing is critical.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-3">
            {useCases.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-border/40 bg-card p-6 transition-colors hover:bg-accent"
              >
                <h2 className="text-title mb-3 text-foreground">{item.title}</h2>
                <p className="text-body mb-4 text-muted-foreground">{item.detail}</p>
                <span className="text-label text-muted-foreground group-hover:text-foreground">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
