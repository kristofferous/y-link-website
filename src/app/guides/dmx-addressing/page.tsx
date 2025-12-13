import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Fixture Addressing",
  description: "Learn to address fixtures correctly for stable AI-driven light sequences.",
  alternates: {
    canonical: "/guides/dmx-addressing",
  },
}

export default function DMXAddressingPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Addressing" }]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Guide</p>
            <h1 className="text-heading-lg text-foreground">Fixture Addressing</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Correct addressing ensures AI-planned cues hit the right channel every time.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Plan Your Patch</h2>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Keep an updated patch list with start address and mode.",
                  "Group similar fixtures for tidy universes.",
                  "Avoid overlap by reserving buffer zones where rigs change often.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Validate Against Controller</h2>
              <p className="text-body text-muted-foreground">
                Y-Link checks the patch before show. Mismatches between patch and actual rig can cause wrong mapping and
                timing drift.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Continue with{" "}
                <Link
                  href="/guides/dmx-universes"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  universes and scaling
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
