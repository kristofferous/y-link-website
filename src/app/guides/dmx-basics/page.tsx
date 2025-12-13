import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "DMX-grunnlag",
  description: "Forstå DMX-signaler, universer og fixture-styring som grunnlag for AI-drevet lys.",
  alternates: {
    canonical: "/guides/dmx-basics",
  },
}

export default function DMXBasicsPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[{ label: "Hjem", href: "/" }, { label: "Guides", href: "/guides" }, { label: "DMX Basics" }]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Guide</p>
            <h1 className="text-heading-lg text-foreground">DMX Basics</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              A brief introduction to DMX so your fixture planning aligns with AI-generated cues from the Y-Link
              controller.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-12">
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Signal and Universe</h2>
              <p className="text-body mb-6 text-muted-foreground">
                DMX512 sends 512 channel values per universe. Each fixture uses channels based on the selected mode.
                Predictable automation requires clear mapping of fixtures to universes and overview of channel usage.
              </p>
              <ul className="space-y-3 text-body text-muted-foreground">
                {[
                  "Map all fixtures with address and channel footprint.",
                  "Keep universes under safe utilization to avoid timing issues.",
                  "Document cabling, splitters, and nodes.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="text-heading mb-4 text-foreground">Fixture Modes</h2>
              <p className="text-body mb-4 text-muted-foreground">
                Choose modes that balance control against channel count. Higher modes give more control but use more
                channels. The AI planner needs correct patch to avoid saturation.
              </p>
              <p className="text-sm text-muted-foreground">
                Continue with{" "}
                <Link
                  href="/guides/dmx-addressing"
                  className="text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  fixture addressing
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
