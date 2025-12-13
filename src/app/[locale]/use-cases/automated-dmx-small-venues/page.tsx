import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Automated DMX for Small Venues",
  description: "Reduce manual programming and get stable shows for small venues with Y-Link.",
  alternates: {
    canonical: "/use-cases/automated-dmx-small-venues",
  },
}

export default function AutomatedSmallVenuesPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Use Cases", href: "/use-cases" },
              { label: "Automated DMX" },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Use Case</p>
            <h1 className="text-heading-lg text-foreground">Automated DMX for Small Venues</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Small venues need quick setups and predictable operation. Y-Link builds light sequences from music, keeps
              timing stable, and lets operators adjust without breaking automation.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Quick Setup",
                body: "Import playlists, add rig data, and run preflight in minutes.",
              },
              {
                title: "Stable Shows",
                body: "Low latency and guardrails ensure the expression holds, even with minimal staffing.",
              },
              {
                title: "Override When You Want",
                body: "Operator can dim, change looks, or lock sections without automation collapsing.",
              },
              {
                title: "Low Maintenance",
                body: "Planning controls saturation and safety limits before show start.",
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
            <h2 className="text-heading mb-6 text-foreground">How to Use Y-Link</h2>
            <ol className="space-y-4 text-body text-muted-foreground">
              {[
                "Send fixture list and universes.",
                "Connect audio source and set energy levels.",
                "Validate timing and safety limits.",
                "Define where operator can override.",
                "Run show with monitoring enabled.",
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
              Read more about the{" "}
              <Link href="/ai-dmx-controller" className="text-foreground underline underline-offset-4 hover:opacity-80">
                AI DMX Controller
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
