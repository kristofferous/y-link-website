import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "DMX Best Practices",
  description: "Practical tips for stable DMX rigs when AI controls the light sequences.",
  alternates: {
    canonical: "/guides/dmx-best-practices",
  },
}

export default function DMXBestPracticesPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Best Practices" }]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Guide</p>
            <h1 className="text-heading-lg text-foreground">DMX Best Practices</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Routines that keep timing stable and guardrails effective when AI controls the lights.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Before Show</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Verify patch and universes against the rig.",
                  "Run preflight on latency, jitter, and saturation.",
                  "Define operator override and emergency procedures.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">During Show</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Keep network and nodes under observation.",
                  "Use guardrails instead of manual jumps when possible.",
                  "Log deviations for later adjustment.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                See also{" "}
                <Link
                  href="/guides/dmx-troubleshooting"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  troubleshooting
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
