import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "DMX Troubleshooting",
  description: "Common errors in DMX rigs and how to solve them when AI drives the light sequences.",
  alternates: {
    canonical: "/guides/dmx-troubleshooting",
  },
}

export default function DMXTroubleshootingPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Troubleshooting" }]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Guide</p>
            <h1 className="text-heading-lg text-foreground">DMX Troubleshooting</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Typical problems and quick actions to keep the show stable.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Common Errors</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Signal drops: check cables, termination, and nodes.",
                  "Wrong mapping: verify patch and addressing.",
                  "Timing glitches: look for network load and node health.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Quick Checklist</h2>
              <ol className="space-y-3 text-body text-muted-foreground">
                {[
                  "Confirm universe and address assignment.",
                  "Check that guardrails and safety limits are active.",
                  "Restart nodes on fault condition, log the event.",
                ].map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/40 bg-accent text-sm font-semibold text-foreground">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                Need basics? Start with{" "}
                <Link
                  href="/guides/dmx-basics"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  DMX Basics
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
