import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "DMX-guider",
  description: "Guider som bygger DMX-grunnlag og støtter AI-drevet, musikkreaktiv kontroll.",
  alternates: {
    canonical: "/guides",
  },
}

const guides = [
  { title: "DMX Basics", href: "/guides/dmx-basics" },
  { title: "Fixture Addressing", href: "/guides/dmx-addressing" },
  { title: "Universes and Scaling", href: "/guides/dmx-universes" },
  { title: "Latency and Jitter", href: "/guides/dmx-latency-jitter" },
  { title: "Best Practices", href: "/guides/dmx-best-practices" },
  { title: "Troubleshooting", href: "/guides/dmx-troubleshooting" },
]

export default function GuidesPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "Guides" }]} className="mb-8" />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Resources</p>
            <h1 className="text-heading-lg text-foreground">DMX Guides for AI-Controlled Lighting</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Build a solid foundation so AI-based DMX automation lands safely in your space. Each guide links back to
              the main AI DMX controller page for context.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex items-center justify-between rounded-lg border border-border/40 bg-card p-5 transition-colors hover:bg-accent"
              >
                <span className="text-body font-medium text-foreground">{guide.title}</span>
                <svg
                  className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
