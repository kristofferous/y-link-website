import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "DMX Universes and Scaling",
  description: "How to plan universes and scale the rig without losing timing.",
  alternates: {
    canonical: "/guides/dmx-universes",
  },
}

export default function DMXUniversesPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: "Universes and Scaling" },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Guide</p>
            <h1 className="text-heading-lg text-foreground">DMX Universes and Scaling</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Good universe planning ensures AI-generated signals maintain timing even as the rig grows.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Distribute the Load</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Keep universes under safe utilization; avoid pushing to 512 on busy shows.",
                  "Distribute power consumption and cable routes to minimize noise and loss.",
                  "Plan reserved universes for temporary fixtures.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Scaling</h2>
              <p className="text-body text-muted-foreground">
                When adding universes, ensure the controller and nodes support synchronous clock and latency monitoring.
                Y-Link enforces timing per universe, but needs correct topology.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Read more about{" "}
                <Link
                  href="/guides/dmx-latency-jitter"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  latency and jitter
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
